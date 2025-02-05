import { Notification } from "@/models/notification.model";
import { connectDB } from "@/lib/connectDB";
import { validateUser } from "@/helper/validateUser";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// DELETE /api/notification/delete/[id]
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    const { success, status, user, error } = await validateUser(req);
    if (!success) {
      return NextResponse.json({ success: false, error }, { status });
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid notification ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const notification = await Notification.findOneAndDelete({
      _id: id,
      receiver: user._id, // Ensure the notification belongs to the logged-in user
    });

    if (!notification) {
      return NextResponse.json(
        { success: false, error: "Notification not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while deleting the notification",
      },
      { status: 500 }
    );
  }
}
