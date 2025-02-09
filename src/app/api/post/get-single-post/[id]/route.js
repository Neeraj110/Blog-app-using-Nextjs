import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/connectDB";
import { validateUser } from "@/helper/validateUser";
import { NextResponse } from "next/server";
import { cacheService } from "@/helper/cacheData";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const { success, error, status } = await validateUser(req);

    if (!success) {
      return NextResponse.json({ success, error }, { status });
    }

    // Try cache first
    const cachedPost = cacheService.getPost(id);
    if (cachedPost) {
      return NextResponse.json({
        success: true,
        data: cachedPost,
        fromCache: true,
      });
    }

    await connectDB();
    const post = await Post.findById(id)
      .select(
        "content media owner likes comments visibility engagement createdAt"
      )
      .populate("owner", "username avatar name")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name username avatar",
        },
        select: "comment content media user createdAt",
      })
      .lean();

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Cache the post
    cacheService.setPost(id, post);

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("Error fetching single post:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
