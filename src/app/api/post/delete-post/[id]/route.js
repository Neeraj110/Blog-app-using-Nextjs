import { User } from "@/models/user.model";
import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";

// Path: src/app/api/post/delete-post/id
export async function DELETE(req, { params }) {
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

    // Find the post to be deleted
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
        {
          status: 403,
        }
      );
    }

    // Delete media from Cloudinary
    if (post.media && post.media.length > 0) {
      for (const media of post.media) {
        if (media.url) {
          await deleteFromCloudinary(media.url);
        }
      }
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(id);
    await user.posts.pull(id);
    await user.bookmarks.pull(id);
    await user.save();

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
      },
      { status: 500 }
    );
  }
}
