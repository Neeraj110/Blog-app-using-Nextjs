import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/connectDB";
import { validateUser } from "@/helper/validateUser";
import { NextResponse } from "next/server";

// GET /api/post/get-following-post
export async function GET(req) {
  try {
    // Validate user with specific fields needed
    const { success, user, error, status } = await validateUser(req, {
      select: "following",
    });

    if (!success) {
      return NextResponse.json({ success, error }, { status });
    }

    await connectDB();

    if (!user.following?.length) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          message: "No following users to fetch posts from",
        },
        { status: 200 }
      );
    }

    // Fetch posts
    const posts = await Post.find({
      owner: { $in: user.following },
      visibility: "public",
    })
      .select(
        "content media owner likes comments createdAt visibility tags engagement"
      )
      .sort({ createdAt: -1 })
      .populate("owner", "username avatar name")
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: posts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts from following users:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
