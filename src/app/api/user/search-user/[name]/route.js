// app/api/user/search-user/[name]/route.js
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { cacheService } from "@/helper/cacheData";

export async function GET(request, { params }) {
  try {
    const { name } = await params;
    const userId = request.headers.get("userid");

    // Validate user ID
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User ID is required" },
        { status: 401 }
      );
    }

    await connectDB();

    // Verify requesting user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - User not found" },
        { status: 401 }
      );
    }

    // Perform search with improved query
    const users = await User.find(
      {
        $and: [
          {
            $or: [
              { name: { $regex: name, $options: "i" } },
              { username: { $regex: name, $options: "i" } },
            ],
          },
          { _id: { $ne: userId } },
        ],
      },
      {
        _id: 1,
        username: 1,
        email: 1,
        avatar: 1,
        name: 1,
      }
    ).limit(50);

    // Cache the results

    return NextResponse.json({
      success: true,
      message: "Users fetched successfully",
      count: users.length,
      users,
      fromCache: false,
    });
  } catch (error) {
    console.error("Error in search-user route:", error);
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
