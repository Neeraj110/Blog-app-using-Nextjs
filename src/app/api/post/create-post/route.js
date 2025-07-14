import { User } from "@/models/user.model";
import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { handleFileUpload } from "@/helper/userHelpers";
import { cacheService } from "@/helper/cacheData";

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

export async function POST(req) {
  try {
    const userId = req.headers.get("userid");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - User ID is required" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.formData();
    const content = body.get("content") || "";
    const files = body.getAll("media") || [];
    const tags = (body.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
    const visibility = body.get("visibility") || "public";

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

    if (files.length > MAX_MEDIA_FILES) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum ${MAX_MEDIA_FILES} media files allowed`,
        },
        { status: 400 }
      );
    }

    const mediaUploads = [];
    for (const file of files) {
      if (
        !ALLOWED_IMAGE_TYPES.includes(file.type) &&
        !ALLOWED_VIDEO_TYPES.includes(file.type)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid file type. Allowed: JPG, PNG, GIF, WEBP, MP4, MOV",
          },
          { status: 400 }
        );
      }

      const uploaded = await handleFileUpload(file, `user-posts/${userId}`);
      if (!uploaded) {
        return NextResponse.json(
          { success: false, error: "Failed to upload media" },
          { status: 500 }
        );
      }

      mediaUploads.push({
        type: file.type.startsWith("video/") ? "video" : "image",
        url: uploaded.url,
        thumbnail: uploaded.thumbnail || null,
        aspectRatio: uploaded.aspectRatio || null,
      });
    }

    const newPost = new Post({
      content,
      media: mediaUploads,
      owner: userId,
      tags,
      visibility,
      engagement: { likeCount: 0, commentCount: 0, shareCount: 0 },
      likes: [],
      comments: [],
      commentUsers: [],
    });

    await newPost.save();

    const populatedPost = await Post.findById(newPost._id)
      .populate("owner", "username avatar name")
      .lean();

    cacheService.invalidatePostCache(userId);

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
      engagement: populatedPost.engagement,
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
        error: "Internal Server Error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
