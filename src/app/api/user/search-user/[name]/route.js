import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { validateUser } from "@/helper/validateUser";
import { headers } from "next/headers";

// GET /api/user/search-user/:name
export async function GET(request, { params }) {
  try {
    const { name } = params;
    const userId = request.headers.get("userid");
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User ID is required" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - User not found" },
        { status: 401 }
      );
    }

    await connectDB();

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

    return NextResponse.json(
      {
        success: true,
        message: "Users fetched successfully",
        count: users.length,
        users,
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
