import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { connectDB } from "@/lib/connectDB";
import { validateUser } from "@/helper/validateUser";
import { Notification } from "@/models/notification.model";

// @route   POST api/user/follow/[id]
export async function POST(req, { params }) {
  try {
    const { id: targetUserId } = params;
    
    // Validate user and connect to DB
    const { user, success, error, status } = await validateUser(req);
    if (!success) {
      return NextResponse.json({ error }, { status });
    }
    
    // Input validation
    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Prevent self-following
    if (user._id.toString() === targetUserId) {
      return NextResponse.json(
        { error: "Users cannot follow themselves" },
        { status: 400 }
      );
    }

    // Find both users in a single query for better performance
    const [targetUser, currentUser] = await Promise.all([
      User.findById(targetUserId),
      User.findById(user._id)
    ]);

    // Validate users exist
    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: "Current user not found" },
        { status: 404 }
      );
    }

    // Check if already following
    const isFollowing = currentUser.following.includes(targetUserId);
    
    // Prepare notification data
    const notificationData = {
      receiver: targetUserId,
      sender: user._id,
      tag: isFollowing ? "Stopped Following" : "New Follower",
      message: isFollowing 
        ? `${user.name} has stopped following you.`
        : `${user.name} started following you.`,
      refUser: user._id // Add reference to the user for potential future use
    };

    try {
      if (isFollowing) {
        // Unfollow logic with atomic updates
        await Promise.all([
          User.findByIdAndUpdate(
            currentUser._id,
            { $pull: { following: targetUserId } },
            { new: true }
          ),
          User.findByIdAndUpdate(
            targetUser._id,
            { $pull: { followers: user._id } },
            { new: true }
          ),
          Notification.create(notificationData)
        ]);

        return NextResponse.json({
          success: true,
          message: "Successfully unfollowed user",
          isFollowing: false,
          followersCount: targetUser.followers.length - 1
        });
      } else {
        // Follow logic with atomic updates
        await Promise.all([
          User.findByIdAndUpdate(
            currentUser._id,
            { $addToSet: { following: targetUserId } },
            { new: true }
          ),
          User.findByIdAndUpdate(
            targetUser._id,
            { $addToSet: { followers: user._id } },
            { new: true }
          ),
          Notification.create(notificationData)
        ]);

        return NextResponse.json({
          success: true,
          message: "Successfully followed user",
          isFollowing: true,
          followersCount: targetUser.followers.length + 1
        });
      }
    } catch (err) {
      console.error("Error updating follow status:", err);
      return NextResponse.json(
        { error: "Failed to update follow status" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Follow route error:", error);
    return NextResponse.json(
      { error: "Something went wrong in follow route" },
      { status: 500 }
    );
  }
}

// GET request to check follow status
export async function GET(req, { params }) {
  try {
    const { id: targetUserId } = params;

    const { user, success, error, status } = await validateUser(req);
    if (!success) {
      return NextResponse.json({ error }, { status });
    }

    await connectDB();

    // Get both user data in a single query
    const [currentUser, targetUser] = await Promise.all([
      User.findById(user._id).select('following'),
      User.findById(targetUserId).select('followers')
    ]);

    if (!currentUser || !targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    return NextResponse.json({
      success: true,
      isFollowing,
      followersCount: targetUser.followers.length
    });
  } catch (error) {
    console.error("Follow status check error:", error);
    return NextResponse.json(
      { error: "Error checking follow status" },
      { status: 500 }
    );
  }
}