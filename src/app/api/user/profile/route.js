// import { connectDB } from "@/lib/connectDB";
// import { User } from "@/models/user.model";
// import { Post } from "@/models/post.model"; // Add this import
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     const userId = req.headers.get("userid");

//     // Connect to the database
//     await connectDB();

//     // Find user by ID
//     const user = await User.findById(userId)
//       .select("-password")
//       .populate("followers", "name username avatar")
//       .populate("following", "name username avatar")
//       .populate({
//         path: "posts",
//         options: { sort: { createdAt: -1 } },
//       })
//       .populate({
//         path: "posts",
//         populate: {
//           path: "likes",
//           se
//         },
//       });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({ user: user.toSafeObject() });
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/user.model";
import { Post } from "@/models/post.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    const userId = req.headers.get("userid");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    const objectId = new mongoose.Types.ObjectId(userId);

    // Execute aggregation pipeline
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

    return NextResponse.json({ user: userProfile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
