
import { User } from "@/models/user.model";
import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/connectDB";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  try {
    // Ensure DB connection
    await connectDB();

    // Extract userId from headers
    const userId = req.headers.get("userid");

    // Await params and extract the postId
    const { id: postId } = await context.params;

    // Validate IDs
    if (!isValidObjectId(userId) || !isValidObjectId(postId)) {
      return NextResponse.json(
        { success: false, error: "Invalid user or post ID" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const isBookmarked = user.bookmarks.includes(post._id.toString());

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (bookmarked) => bookmarked.toString() !== post._id.toString()
      );
    } else {
      user.bookmarks.unshift(post._id);
    }

    await user.save();

    // Send success response
    return NextResponse.json(
      {
        success: true,
        message: isBookmarked ? "Post unbookmarked" : "Post bookmarked",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Bookmark Post API Error:", error.message, error.stack);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
