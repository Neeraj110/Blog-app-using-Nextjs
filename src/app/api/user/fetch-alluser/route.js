import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { connectDB } from "@/lib/connectDB";

export async function GET(req) {
  try {
    const userid = req.headers.get("userid");

    if (!userid) {
      return NextResponse.json(
        { error: "Unauthorized - User ID is required" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Verify the requesting user exists
    const currentUser = await User.findById(userid);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all users except the current user
    const allUsers = await User.find(
      { _id: { $ne: userid } },

      {
        _id: 1,
        username: 1,
        email: 1,
        avatar: 1,
        name: 1,
      }
    ).sort({ createdAt: -1 }); // Sort by newest first (optional)

    return NextResponse.json(
      {
        success: true,
        message: "Users fetched successfully",
        count: allUsers.length,
        users: allUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while fetching users",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
