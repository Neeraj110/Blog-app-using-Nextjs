import { User } from "@/models/user.model";
import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { handleFileUpload } from "@/helper/userHelpers";
import { deleteFromCloudinary } from "@/lib/cloudinary";

// Validation constants
const MAX_CONTENT_LENGTH = 500;
const MAX_TAGS = 5;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];
const MAX_MEDIA_FILES = 3;

export async function PATCH(req, { params }) {
  try {
    const userId = req.headers.get("userid");
    const { id } = await params;

    // Validate user authentication
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - User ID is required" },
        { status: 401 }
      );
    }

    await connectDB();
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Find the post to be updated
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if the user is the owner of the post
    if (post.owner.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get and validate form data
    const body = await req.formData();
    const content = body.get("content")?.trim() || "";
    const existingMedia = JSON.parse(body.get("existingMedia") || "[]");
    const files = body.getAll("media");
    const tags = (body.get("tags")?.split(",") || []).map((tag) =>
      tag.trim().toLowerCase()
    );
    const visibility = body.get("visibility") || post.visibility;

    // Validate content and tags
    if (content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: `Content exceeds ${MAX_CONTENT_LENGTH} characters`,
        },
        { status: 400 }
      );
    }
    if (tags.length > MAX_TAGS) {
      return NextResponse.json(
        { success: false, error: `Maximum ${MAX_TAGS} tags allowed` },
        { status: 400 }
      );
    }
    if (files.length + existingMedia.length > MAX_MEDIA_FILES) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum ${MAX_MEDIA_FILES} media files allowed`,
        },
        { status: 400 }
      );
    }

    // Remove deleted media from Cloudinary
    if (post.media && post.media.length > 0) {
      const mediaToDelete = post.media.filter(
        oldMedia => !existingMedia.some(media => media.url === oldMedia.url)
      );
      
      for (const media of mediaToDelete) {
        if (media.url) {
          await deleteFromCloudinary(media.url);
        }
      }
    }

    // Handle media uploads
    const mediaUploads = [];
    try {
      for (const file of files) {
        if (
          !ALLOWED_IMAGE_TYPES.includes(file.type) &&
          !ALLOWED_VIDEO_TYPES.includes(file.type)
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Invalid file type. Allowed types: JPG, PNG, GIF, WEBP, MP4, MOV",
            },
            { status: 400 }
          );
        }

        const uploadedMedia = await handleFileUpload(
          file,
          `user-posts/${userId}`
        );
        if (!uploadedMedia) {
          throw new Error("Media upload failed");
        }

        mediaUploads.push({
          type: file.type.startsWith("video/") ? "video" : "image",
          url: uploadedMedia.url,
          thumbnail: uploadedMedia?.thumbnail || null,
          aspectRatio: uploadedMedia?.aspectRatio || null,
        });
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      return NextResponse.json(
        { success: false, error: "Failed to upload media files" },
        { status: 500 }
      );
    }

    // Update post with both existing and new media
    post.content = content;
    post.media = [...existingMedia, ...mediaUploads];
    post.tags = tags;
    post.visibility = visibility;

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("owner", "username avatar name")
      .lean();

    const responsePost = {
      _id: populatedPost._id,
      content: populatedPost.content,
      media: populatedPost.media,
      owner: {
        _id: populatedPost.owner._id,
        name: populatedPost.owner.name,
        username: populatedPost.owner.username,
        avatar: populatedPost.owner.avatar,
      },
      tags: populatedPost.tags,
      visibility: populatedPost.visibility,
      createdAt: populatedPost.createdAt,
      updatedAt: populatedPost.updatedAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Post updated successfully",
        post: responsePost,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while updating the post",
      },
      { status: 500 }
    );
  }
}
