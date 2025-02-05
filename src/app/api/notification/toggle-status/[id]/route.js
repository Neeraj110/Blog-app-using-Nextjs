import { Notification } from "@/models/notification.model";
import { connectDB } from "@/lib/connectDB";
import { validateUser } from "@/helper/validateUser";
import { NextResponse } from "next/server";

// PATCH /api/notification/toggle-status/[id]
export async function PATCH(req, { params }) {
  try {
    const { id } = await params; // Notification ID
    const userid = req.headers.get("userid"); // Logged-in user ID

    const { success, status, user, error } = await validateUser(req);

    if (!success) {
      return NextResponse.json({ error }, { status });
    }

    await connectDB();

    const notification = await Notification.findById(id);
    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    if (notification.receiver.toString() !== userid) {
      return NextResponse.json(
        { error: "Access denied. You cannot modify this notification." },
        { status: 403 }
      );
    }

    notification.unread = false;
    await notification.save();

    return NextResponse.json({
      success: true,
      message: "Notification status updated successfully",
      notification,
    });
  } catch (error) {
    console.error("Error toggling notification status:", error);
    return NextResponse.json(
      { error: "Something went wrong while updating notification status" },
      { status: 500 }
    );
  }
}
