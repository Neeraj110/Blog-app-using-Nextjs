import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/connectDB";
import { validateUser } from "@/helper/validateUser";
import { NextResponse } from "next/server";
import { cacheService } from "@/helper/cacheData";

export async function GET(req) {
  try {
    // Validate user first
    const { success, user, error, status } = await validateUser(req);
    if (!success) {
      return NextResponse.json({ success, error }, { status });
    }

    const visibility =  "public";

    // Try cache first
    const cachedPosts = cacheService.getAllPosts(user?._id, visibility);
    if (cachedPosts) {
      return NextResponse.json(
        {
          success: true,
          data: cachedPosts,
          fromCache: true,
        },
        { status: 200 }
      );
    }

    await connectDB();

    // Build query based on user authentication
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

    // Fetch posts
    const allPosts = await Post.find(query)
      .select({
        content: 1,
        media: 1,
        owner: 1,
        likes: 1,
        comments: 1,
        tags: 1,
        visibility: 1,
        engagement: 1,
        createdAt: 1,
      })
      .sort({ createdAt: -1 })
      .populate("owner", "username avatar name")
      .lean();

    // Cache with appropriate TTL
    const ttl = user ? 300 : 600; // 5 mins for authenticated, 10 mins for public
    cacheService.setAllPosts(user?._id, visibility, allPosts, ttl);

    return NextResponse.json(
      {
        success: true,
        data: allPosts,
        fromCache: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error.message);

    // Try serving cached public posts as fallback
    const cachedPublicPosts = cacheService.getAllPosts(null, "public");
    if (cachedPublicPosts) {
      return NextResponse.json(
        {
          success: true,
          data: cachedPublicPosts,
          fromCache: true,
          warning: "Served from cache due to error",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
