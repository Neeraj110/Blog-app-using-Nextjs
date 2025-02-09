import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/connectDB";
import { validateUser } from "@/helper/validateUser";
import { NextResponse } from "next/server";
import { cacheService } from "@/helper/cacheData";

export async function GET(req) {
  try {
    const { success, user, error, status } = await validateUser(req, {
      select: "following",
    });

    if (!success) {
      return NextResponse.json({ success, error }, { status });
    }

    // Try cache first
    const cachedPosts = cacheService.getFollowingPosts(user._id);
    if (cachedPosts) {
      return NextResponse.json({
        success: true,
        data: cachedPosts,
        fromCache: true,
      });
    }

    await connectDB();

    if (!user.following?.length) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "No following users to fetch posts from",
      });
    }

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

    // Cache the results
    cacheService.setFollowingPosts(user._id, posts);

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching posts from following users:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
