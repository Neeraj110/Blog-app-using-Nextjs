import { User } from "@/models/user.model";
import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { cacheService } from "@/helper/cacheData";

// Path: src/app/api/post/delete-post/[id]
export async function DELETE(req, { params }) {
  try {
    const userId = req.headers.get("userid");
    // Await params before accessing properties (Next.js 15 requirement)
    const { id: postId } = await params;

    // Validate user authentication
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - User ID is required" },
        { status: 401 }
      );
    }

    await connectDB();

    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Authorization check
    if (post.owner.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - You don't own this post" },
        { status: 403 }
      );
    }

    // Delete media from Cloudinary
    if (Array.isArray(post.media)) {
      for (const media of post.media) {
        if (media?.url) await deleteFromCloudinary(media.url);
      }
    }

    // Remove post reference from user
    user.posts.pull(postId);
    user.bookmarks.pull(postId);
    await user.save();

    // Delete post
    await post.deleteOne();

    // Invalidate related cache
    cacheService.invalidatePostCache(postId);
    cacheService.invalidateUserCache(userId);

    return NextResponse.json(
      { success: true, message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while deleting the post",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
