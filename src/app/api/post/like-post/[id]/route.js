import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/connectDB";
import { validateUser } from "@/helper/validateUser";
import { Notification } from "@/models/notification.model";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    // Validate user and connect to DB
    const { success, user, error, status } = await validateUser(req);
    if (!success) {
      return NextResponse.json({ success, error }, { status });
    }

    await connectDB();

    // Validate post ID
    const { id: postId } = params;
    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Find post and check if it exists
    const post = await Post.findById(postId)
      .select('likes engagement owner')
      .populate('owner', 'username'); // Only get necessary fields

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const alreadyLiked = post.likes.includes(user._id);

    // Use atomic updates for better performance
    const updateOperation = alreadyLiked
      ? {
          $pull: { likes: user._id },
          $inc: { 'engagement.likeCount': -1 }
        }
      : {
          $addToSet: { likes: user._id },
          $inc: { 'engagement.likeCount': 1 }
        };

    // Execute post update
    const updatePostPromise = Post.findByIdAndUpdate(
      postId,
      updateOperation,
      { new: true }
    ).select('engagement likes');

    // Create notification if it's a new like and not the user's own post
    let notificationPromise = Promise.resolve(null);
    if (!alreadyLiked && post.owner._id.toString() !== user._id.toString()) {
      const notificationData = {
        receiver: post.owner._id,
        sender: user._id,
        refPost: postId,
        tag: "New Like",
        message: `${user.username} liked your post`,
        unread: true,
        createdAt: new Date()
      };

      notificationPromise = Notification.create(notificationData).catch(error => {
        // Log notification error but don't fail the like operation
        console.error("Error creating like notification:", error);
        return null;
      });
    }

    // Wait for both operations to complete
    const [updatedPost, notification] = await Promise.all([
      updatePostPromise,
      notificationPromise
    ]);

    // Prepare response data
    const responseData = {
      success: true,
      message: alreadyLiked ? "Post unliked successfully" : "Post liked successfully",
      likeCount: updatedPost.engagement.likeCount,
      isLiked: !alreadyLiked,
      notificationSent: !!notification
    };

    // Add notification ID if one was created
    if (notification) {
      responseData.notificationId = notification._id;
    }

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error("Error in like/unlike operation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process like/unlike",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}