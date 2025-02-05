import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Connect to the database
    await connectDB();

    // Find the user by email and fetch password for verification
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the password
    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return NextResponse.json({ error: "User not verified" }, { status: 403 });
    }

    // Generate JWT token
    const token = await user.generateAccessToken();

    // Fetch full user details using aggregation for consistency
    const objectId = new mongoose.Types.ObjectId(user._id);
    const [userProfile] = await User.aggregate([
      { $match: { _id: objectId } },
      { $project: { password: 0 } }, // Exclude password field
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
          as: "following",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "owner",
          pipeline: [
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
            {
              $lookup: {
                from: "users",
                localField: "likes",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
                as: "likes",
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "comments.user",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
                as: "commentUsers",
              },
            },
            { $sort: { createdAt: -1 } },
          ],
          as: "posts",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "bookmarks",
          foreignField: "_id",
          pipeline: [
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
            {
              $lookup: {
                from: "users",
                localField: "likes",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
                as: "likes",
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "comments.user",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
                as: "commentUsers",
              },
            },
            { $sort: { createdAt: -1 } },
          ],
          as: "bookmarks",
        },
      },
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
            {
              $lookup: {
                from: "users",
                localField: "comments.user",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, username: 1, avatar: 1 } }],
                as: "commentUsers",
              },
            },
            { $sort: { createdAt: -1 } },
          ],
          as: "likedPosts",
        },
      },
    ]);

    if (!userProfile) {
      return NextResponse.json(
        { error: "User data not found" },
        { status: 404 }
      );
    }

    // Set the token as an HTTP-only cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: userProfile,
    });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 10, // 10 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
