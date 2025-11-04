import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { connectDB } from "@/lib/connectDB";
import { validateUser } from "@/helper/validateUser";
import { Notification } from "@/models/notification.model";

// POST: /api/user/follow/[id] - Follow or unfollow a user
export async function POST(req, { params }) {
  try {
    await connectDB();
    // Await params before accessing properties (Next.js 15 requirement)
    const { id: targetUserId } = await params;
    const { user, success, error, status } = await validateUser(req);
    if (!success) return NextResponse.json({ error }, { status });
    if (!targetUserId)
      return NextResponse.json(
        { error: "Target user ID is required" },
        { status: 400 }
      );
    if (user._id.toString() === targetUserId)
      return NextResponse.json(
        { error: "Users cannot follow themselves" },
        { status: 400 }
      );

    const [targetUser, currentUser] = await Promise.all([
      User.findById(targetUserId).select("followers"),
      User.findById(user._id).select("following"),
    ]);

    if (!targetUser || !currentUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isFollowing = currentUser.following.includes(targetUserId);

    const updateOps = isFollowing
      ? [
          User.updateOne(
            { _id: user._id },
            { $pull: { following: targetUserId } }
          ),
          User.updateOne(
            { _id: targetUserId },
            { $pull: { followers: user._id } }
          ),
        ]
      : [
          User.updateOne(
            { _id: user._id },
            { $addToSet: { following: targetUserId } }
          ),
          User.updateOne(
            { _id: targetUserId },
            { $addToSet: { followers: user._id } }
          ),
        ];

    const notification = Notification.create({
      receiver: targetUserId,
      sender: user._id,
      tag: isFollowing ? "Stopped Following" : "New Follower",
      message: isFollowing
        ? `${user.name} has stopped following you.`
        : `${user.name} started following you.`,
      refUser: user._id,
    });

    await Promise.all([...updateOps, notification]);

    return NextResponse.json({
      success: true,
      message: isFollowing
        ? "Successfully unfollowed user"
        : "Successfully followed user",
      isFollowing: !isFollowing,
      followersCount: isFollowing
        ? targetUser.followers.length - 1
        : targetUser.followers.length + 1,
    });
  } catch (err) {
    console.error("Follow route error:", err);
    return NextResponse.json(
      { error: "Something went wrong in follow route" },
      { status: 500 }
    );
  }
}

// GET: /api/user/follow/[id]
export async function GET(req, { params }) {
  try {
    await connectDB();
    // Await params before accessing properties (Next.js 15 requirement)
    const { id: targetUserId } = await params;
    const { user, success, error, status } = await validateUser(req);

    if (!success) return NextResponse.json({ error }, { status });

    const [currentUser, targetUser] = await Promise.all([
      User.findById(user._id).select("following"),
      User.findById(targetUserId).select("followers"),
    ]);

    if (!currentUser || !targetUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isFollowing = currentUser.following.includes(targetUserId);

    return NextResponse.json({
      success: true,
      isFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (err) {
    console.error("Follow status check error:", err);
    return NextResponse.json(
      { error: "Error checking follow status" },
      { status: 500 }
    );
  }
}
