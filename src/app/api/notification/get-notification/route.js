import { Notification } from "@/models/notification.model";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { validateUser } from "@/helper/validateUser";

// GET /api/notification/get-notification
export async function GET(req) {
  try {
    // Get URL parameters
    const url = new URL(req.url);
    const unreadOnly = url.searchParams.get("unreadOnly") === "true";
    const type = url.searchParams.get("type"); // For filtering by notification type

    // Validate user
    const { success, status, user, error } = await validateUser(req);
    if (!success) {
      return NextResponse.json({ success: false, error }, { status });
    }

    await connectDB();

    // Build query
    const baseQuery = {
      receiver: user._id,
      ...(unreadOnly && { unread: true }),
      ...(type && { tag: type }),
    };

    // Fetch all notifications based on query
    const notifications = await Notification.find(baseQuery)
      .sort({ createdAt: -1 }) // Newest first
      .populate("sender", "name avatar username")
      .populate("refPost", "content images") // Optionally populate referenced post
      .select("-__v")
      .lean();

    // Get unread count in parallel
    const unreadCount = await Notification.countDocuments({
      receiver: user._id,
      unread: true,
    });

    // Process notifications
    const processedNotifications = notifications.map((notification) => ({
      ...notification,
      timeAgo: getTimeAgo(notification.createdAt),
      sender: notification.sender
        ? {
            ...notification.sender,
            avatar:
              notification.sender.avatar ||
              getDefaultAvatar(notification.sender.name),
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        notifications: processedNotifications,
        meta: {
          unreadCount,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch notifications",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Helper function to generate relative time
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }

  return "just now";
}

// Helper function to generate default avatar
function getDefaultAvatar(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random`;
}
