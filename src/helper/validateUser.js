import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/user.model";

export async function validateUser(req) {
  try {
    const userId = req.headers.get("userid");
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized - User ID is required",
        status: 401,
      };
    }

    // Connect to the database (optional: ensure single connection instance)
    await connectDB();

    // Find the current user
    const user = await User.findById(userId).lean();
    if (!user) {
      return {
        success: false,
        error: "User not found",
        status: 404,
      };
    }

    return { success: true, user };
  } catch (error) {
    console.error("User validation error:", error.message);
    return {
      success: false,
      error: "Internal Server Error",
      status: 500,
    };
  }
}
