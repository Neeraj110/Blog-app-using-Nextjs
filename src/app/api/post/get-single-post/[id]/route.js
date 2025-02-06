import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/connectDB";
import { validateUser } from "@/helper/validateUser";
import { NextResponse } from "next/server";

// api/post/get-single-post/[id]
export async function GET(req, { params }) {
  try {
    // Validate user
    const { id } = await params;
    const { success, error, status } = await validateUser(req);

    if (!success) {
      return NextResponse.json({ success, error }, { status });
    }

    // Connect to the database
    await connectDB();

    // Fetch single post
    const post = await Post.findById(id)
      .select(
        "content media owner likes comments visibility engagement createdAt"
      )
      .populate("owner", "username avatar name")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name username avatar", // Fetch user details for each comment
        },
        select: "comment content media user createdAt", // Select comment-specific fields
      })
      .lean();

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: "Post not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: post,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching single post:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
