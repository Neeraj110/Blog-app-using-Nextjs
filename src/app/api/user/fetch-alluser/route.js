import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { connectDB } from "@/lib/connectDB";
import { cacheService } from "@/helper/cacheData";

export async function GET(req) {
  try {
    const userid = req.headers.get("userid");
    if (!userid) {
      return NextResponse.json(
        { error: "Unauthorized - User ID is required" },
        { status: 401 }
      );
    }

    // Try cache first with error handling
    const cachedUsers = cacheService.getUsersList();
    if (cachedUsers && Array.isArray(cachedUsers)) {
      return NextResponse.json({
        success: true,
        message: "Users fetched from cache",
        count: cachedUsers.length,
        users: cachedUsers,
        fromCache: true
      });
    }

    await connectDB();
    const currentUser = await User.findById(userid);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const allUsers = await User.find(
      { _id: { $ne: userid } },
      {
        _id: 1,
        username: 1,
        email: 1,
        avatar: 1,
        name: 1,
      }
    ).lean().sort({ createdAt: -1 });

    // Cache the results with validation
    if (allUsers && Array.isArray(allUsers)) {
      const cacheSuccess = cacheService.setUsersList(allUsers);
      if (!cacheSuccess) {
        console.warn("Failed to cache users list");
      }
    }

    return NextResponse.json({
      success: true,
      message: "Users fetched successfully",
      count: allUsers.length,
      users: allUsers,
      fromCache: false
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "An error occurred while fetching users",
        message: error.message 
      },
      { status: 500 }
    );
  }
}