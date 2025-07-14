import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/user.model";

import { cacheService } from "@/helper/cacheData";

export async function GET(req) {
  try {
    const userId = req.headers.get("userid");
    if (!userId)
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );

    const cachedProfile = cacheService.getUserProfile(userId);
    if (cachedProfile) return NextResponse.json({ user: cachedProfile });

    await connectDB();
    const user = await User.findById(userId)
      .select("-password")
      .populate("followers", "name username avatar")
      .populate("following", "name username avatar")
      .populate({
        path: "posts",
        populate: [
          { path: "owner", select: "name username avatar" },
          { path: "likes", select: "name username avatar" },
          { path: "commentUsers", select: "name username avatar" },
        ],
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: "bookmarks",
        populate: [
          { path: "owner", select: "name username avatar" },
          { path: "likes", select: "name username avatar" },
          { path: "commentUsers", select: "name username avatar" },
        ],
        options: { sort: { createdAt: -1 } },
      });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    cacheService.setUserProfile(userId, user.toObject());
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
