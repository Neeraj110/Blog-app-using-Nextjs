import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { validateUser } from "@/helper/validateUser";
import { headers } from "next/headers";
import { cacheService } from "@/helper/cacheData";

// GET /api/user/search-user/:name
export async function GET(request, { params }) {
  try {
    const { name } = params;
    const userId = request.headers.get("userid");

    // Validate user ID
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User ID is required" },
        { status: 401 }
      );
    }

    // Check cache first
    const cachedResults = cacheService.getSearchResults(name, userId);
    if (cachedResults) {
      return NextResponse.json(
        {
          success: true,
          message: "Users fetched from cache",
          count: cachedResults.length,
          users: cachedResults,
          fromCache: true,
        },
        { status: 200 }
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

    // Perform search
    const users = await User.find(
      {
        name: { $regex: name, $options: "i" },
        _id: { $ne: userId },
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
    cacheService.setSearchResults(name, userId, users);

    return NextResponse.json(
      {
        success: true,
        message: "Users fetched successfully",
        count: users.length,
        users,
        fromCache: false,
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
