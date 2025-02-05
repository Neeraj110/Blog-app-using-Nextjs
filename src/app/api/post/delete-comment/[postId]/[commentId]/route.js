import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/connectDB";
import { validateUser } from "@/helper/validateUser"; // Assuming this utility checks user authentication
import { NextResponse } from "next/server";

// api/post/delete-comment/[id]
export async function DELETE(req, { params }) {
  try {
    // Validate the user
    const { success, user, error, status } = await validateUser(req);
    if (!success) {
      return NextResponse.json({ success, error }, { status });
    }

    const { postId, commentId } = params;

    // Connect to the database
    await connectDB();

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Find the comment by ID
    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if the user is the author of the comment or the post owner
    if (
      comment.user.toString() !== user._id.toString() &&
      post.owner.toString() !== user._id.toString()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - You can only delete your own comments",
        },
        { status: 403 }
      );
    }

    // Pull the comment from the post's comments array
    post.comments.pull(commentId);

    // Save the post after deleting the comment
    await post.save();

    return NextResponse.json(
      { success: true, message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
