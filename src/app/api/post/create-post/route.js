import { User } from "@/models/user.model";
import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { handleFileUpload } from "@/helper/userHelpers";

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
const MAX_MEDIA_FILES = 10;

// api/tweet/create-post
export async function POST(req) {
  try {
    // Validate user authentication
    const userid = req.headers.get("userid");

    if (!userid) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - User ID is required",
        },
        { status: 401 }
      );
    }

    await connectDB();
    // Verify user exists
    const user = await User.findById(userid);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Get and validate form data
    const body = await req.formData();
    const content = body.get("content") || "";
    const files = body.getAll("media");
    const tags =
      body
        .get("tags")
        ?.split(",")
        .map((tag) => tag.trim().toLowerCase()) || [];
    const visibility = body.get("visibility") || "public";

    // Validate content length
    if (content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

    // Validate tags
    if (tags.length > MAX_TAGS) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum ${MAX_TAGS} tags allowed`,
        },
        { status: 400 }
      );
    }

    // Validate number of files
    if (files.length > MAX_MEDIA_FILES) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum ${MAX_MEDIA_FILES} media files allowed`,
        },
        { status: 400 }
      );
    }

    // Handle media uploads
    const mediaUploads = [];
    try {
      for (const file of files) {
        // Validate file type
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
          `user-posts/${userid}`
        );

        if (!uploadedMedia) {
          throw new Error("Media upload failed");
        }

        mediaUploads.push({
          type: file.type.startsWith("video/") ? "video" : "image",
          url: uploadedMedia?.url,
          thumbnail: uploadedMedia?.thumbnail || null,
          aspectRatio: uploadedMedia?.aspectRatio || null,
        });
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to upload media files",
        },
        { status: 500 }
      );
    }

    // Create and save the post
    const newPost = new Post({
      content,
      media: mediaUploads,
      owner: userid,
      tags: tags.filter(Boolean),
      visibility,
      engagement: {
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
      },
      likes: [],
      comments: [],
      commentUsers: [],
    });

    await newPost.save();

    // Populate owner details and convert to plain object
    const populatedPost = await Post.findById(newPost._id)
      .populate("owner", "username avatar name")
      .lean();

    // Manually construct the response with all required fields
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
      engagement: {
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
      },
      likes: [],
      comments: [],
      commentUsers: [],
    };

    return NextResponse.json(
      {
        success: true,
        message: "Post created successfully",
        post: responsePost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while creating the post",
        message: error.message ? error.message : null,
      },
      { status: 500 }
    );
  }
}
