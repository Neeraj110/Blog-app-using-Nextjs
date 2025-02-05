import { User } from "@/models/user.model";
import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/connectDB";
import { validateUser } from "@/helper/validateUser";
import { NextResponse } from "next/server";

// GET /api/post/get-all-post
export async function GET(req) {
  try {
    await connectDB();

    const { success, user, error, status } = await validateUser(req);

    if (!success) {
      return NextResponse.json({ success, error }, { status });
    }

    const query =
      success && user
        ? {
            $or: [
              { visibility: "public" },
              { visibility: "followers", owner: { $in: user.following || [] } },
              { visibility: "private", owner: user._id },
            ],
          }
        : { visibility: "public" };

    const allPosts = await Post.find(query)
      .select(
        "content media owner likes comments tags visibility engagement createdAt"
      )
      .sort({ createdAt: -1 })
      .populate("owner", "username avatar name")
      .lean();

    return NextResponse.json(
      { success: true, data: allPosts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
