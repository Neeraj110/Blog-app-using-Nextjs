import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/connectDB";
import { validateUser } from "@/helper/validateUser";
import { NextResponse } from "next/server";
import { Notification } from "@/models/notification.model";

export async function POST(req, { params }) {
  try {
    // Validate user and connect to DB
    const { success, user, error, status } = await validateUser(req);
    if (!success) {
      return NextResponse.json({ success, error }, { status });
    }

    await connectDB();

    // Extract and validate parameters
    const { id: postId } = params;
    const { comment } = await req.json();

    // Input validation
    if (!comment?.trim()) {
      return NextResponse.json(
        { success: false, error: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Find post and validate
    const post = await Post.findById(postId)
      .populate('owner', 'name') // Populate owner details for notification
      .select('owner comments engagement'); // Select only needed fields

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Create new comment
    const newComment = {
      user: user._id,
      comment: comment.trim(),
      createdAt: new Date()
    };

    // Update post with new comment
    const updatePostPromise = Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: newComment },
        $inc: { 'engagement.commentCount': 1 }
      },
      { new: true }
    ).select('engagement');

    // Create notification if comment is from different user
    let notificationPromise = Promise.resolve(null);
    if (post.owner._id.toString() !== user._id.toString()) {
      const notificationData = {
        receiver: post.owner._id,
        sender: user._id,
        refPost: post._id,
        tag: "New Comment",
        message: `${user.name} commented on your post: "${comment.length > 50 ? comment.substring(0, 47) + '...' : comment}"`,
        unread: true,
        createdAt: new Date()
      };

      notificationPromise = Notification.create(notificationData);

      // If the post owner was mentioned in the comment, add an additional notification
      if (comment.includes(`@${post.owner.name}`)) {
        const mentionNotificationData = {
          ...notificationData,
          tag: "Mention in Comment",
          message: `${user.name} mentioned you in a comment: "${comment.length > 50 ? comment.substring(0, 47) + '...' : comment}"`
        };
        notificationPromise = Promise.all([
          notificationPromise,
          Notification.create(mentionNotificationData)
        ]);
      }
    }

    // Execute both promises concurrently
    const [updatedPost, notification] = await Promise.all([
      updatePostPromise,
      notificationPromise
    ]).catch(error => {
      console.error("Error in parallel operations:", error);
      throw error;
    });

    // Prepare the response
    return NextResponse.json(
      {
        success: true,
        message: "Comment added successfully",
        commentCount: updatedPost.engagement.commentCount,
        newComment: {
          ...newComment,
          user: {
            _id: user._id,
            name: user.name
          }
        },
        notificationSent: !!notification
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to add comment",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}