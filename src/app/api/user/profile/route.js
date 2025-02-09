import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cacheService } from "@/helper/cacheData";

export async function GET(req) {
  try {
    const userId = req.headers.get("userid");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Try cache first
    const cachedProfile = cacheService.getUserProfile(userId);
    if (cachedProfile) {
      return NextResponse.json({ user: cachedProfile });
    }

    await connectDB();
    const objectId = new mongoose.Types.ObjectId(userId);
    const [userProfile] = await User.aggregate([
      // Match the specific user
      { $match: { _id: objectId } },

      // Remove password field
      { $project: { password: 0 } },

      // Lookup and populate followers
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
          as: "followers",
        },
      },

      // Lookup and populate following
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
          as: "following",
        },
      },

      // Lookup user's posts
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "owner",
          pipeline: [
            // Populate post owner
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
                as: "owner",
              },
            },
            { $unwind: "$owner" },

            // Populate post likes
            {
              $lookup: {
                from: "users",
                localField: "likes",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
                as: "likes",
              },
            },

            // Populate comments and their users
            {
              $lookup: {
                from: "users",
                localField: "comments.user",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
                as: "commentUsers",
              },
            },

            // Sort by creation date
            { $sort: { createdAt: -1 } },
          ],
          as: "posts",
        },
      },

      // Lookup bookmarked posts
      {
        $lookup: {
          from: "posts",
          localField: "bookmarks",
          foreignField: "_id",
          pipeline: [
            // Populate post owner
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
                as: "owner",
              },
            },
            { $unwind: "$owner" },

            // Populate post likes
            {
              $lookup: {
                from: "users",
                localField: "likes",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
                as: "likes",
              },
            },

            // Populate comments and their users
            {
              $lookup: {
                from: "users",
                localField: "comments.user",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
                as: "commentUsers",
              },
            },

            // Sort by creation date
            { $sort: { createdAt: -1 } },
          ],
          as: "bookmarks",
        },
      },

      // Lookup liked posts
      {
        $lookup: {
          from: "posts",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$userId", "$likes"],
                },
              },
            },
            // Populate post owner
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
                as: "owner",
              },
            },
            { $unwind: "$owner" },

            // Populate comments and their users
            {
              $lookup: {
                from: "users",
                localField: "comments.user",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
                as: "commentUsers",
              },
            },

            // Sort by creation date
            { $sort: { createdAt: -1 } },
          ],
          as: "likedPosts",
        },
      },
    ]);

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Cache the profile
    cacheService.setUserProfile(userId, userProfile);

    return NextResponse.json({ user: userProfile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}