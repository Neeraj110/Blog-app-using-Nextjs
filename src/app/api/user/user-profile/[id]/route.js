import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    // Await params before accessing properties (Next.js 15 requirement)
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    const objectId = new mongoose.Types.ObjectId(id);
    const currentUserId = req.headers.get("userid"); // Get current user's ID from headers

    // Execute aggregation pipeline
    const [userProfile] = await User.aggregate([
      // Match the specific user
      { $match: { _id: objectId } },

      // Remove password field
      { $project: { password: 0 } },

      // Add a field to check if the current user is following this profile
      {
        $addFields: {
          isFollowedByCurrentUser: {
            $cond: {
              if: {
                $in: [
                  new mongoose.Types.ObjectId(currentUserId || ""),
                  "$followers",
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },

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

            // Add field to check if current user liked the post
            {
              $addFields: {
                isLikedByCurrentUser: {
                  $cond: {
                    if: {
                      $in: [
                        new mongoose.Types.ObjectId(currentUserId || ""),
                        "$likes",
                      ],
                    },
                    then: true,
                    else: false,
                  },
                },
              },
            },

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

            // Process comments to include user info
            {
              $addFields: {
                comments: {
                  $map: {
                    input: "$comments",
                    as: "comment",
                    in: {
                      $mergeObjects: [
                        "$$comment",
                        {
                          user: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$commentUsers",
                                  as: "user",
                                  cond: {
                                    $eq: ["$$user._id", "$$comment.user"],
                                  },
                                },
                              },
                              0,
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },

            // Remove the temporary commentUsers field
            {
              $project: {
                commentUsers: 0,
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

            // Add field to check if current user liked the post
            {
              $addFields: {
                isLikedByCurrentUser: {
                  $cond: {
                    if: {
                      $in: [
                        new mongoose.Types.ObjectId(currentUserId || ""),
                        "$likes",
                      ],
                    },
                    then: true,
                    else: false,
                  },
                },
              },
            },

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

            // Process comments to include user info
            {
              $addFields: {
                comments: {
                  $map: {
                    input: "$comments",
                    as: "comment",
                    in: {
                      $mergeObjects: [
                        "$$comment",
                        {
                          user: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$commentUsers",
                                  as: "user",
                                  cond: {
                                    $eq: ["$$user._id", "$$comment.user"],
                                  },
                                },
                              },
                              0,
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },

            // Remove the temporary commentUsers field
            {
              $project: {
                commentUsers: 0,
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

            // Add field to check if current user liked the post
            {
              $addFields: {
                isLikedByCurrentUser: {
                  $cond: {
                    if: {
                      $in: [
                        new mongoose.Types.ObjectId(currentUserId || ""),
                        "$likes",
                      ],
                    },
                    then: true,
                    else: false,
                  },
                },
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

            // Process comments to include user info
            {
              $addFields: {
                comments: {
                  $map: {
                    input: "$comments",
                    as: "comment",
                    in: {
                      $mergeObjects: [
                        "$$comment",
                        {
                          user: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$commentUsers",
                                  as: "user",
                                  cond: {
                                    $eq: ["$$user._id", "$$comment.user"],
                                  },
                                },
                              },
                              0,
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },

            // Remove the temporary commentUsers field
            {
              $project: {
                commentUsers: 0,
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
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
