import connectDB from "@/lib/connectDB";
import { User } from "@/models/user.model";
import { deleteFromCloudinary } from "@/lib/cloudinary"; // Assuming you have a Cloudinary utility
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const userid = req.headers.get("userid");
    const body = await req.formData();
    const action = body.get("action"); // "save" or "remove"
    const coverImg = body.get("coverImg"); // New avatar image URL

    if (!userid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(userid);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "remove") {
      if (user.coverImg) {
        await deleteFromCloudinary(user.coverImg);
      }
      user.coverImg = null;
    } else if (action === "save" && coverImg) {
      if (user.coverImg) {
        await deleteFromCloudinary(user.coverImg);
      }
      user.coverImg = coverImg;
    } else {
      return NextResponse.json(
        { error: "Invalid action or missing avatar data" },
        { status: 400 }
      );
    }

    await user.save();

    return NextResponse.json(
      { message: "Avatar updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in update-avatar:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating the cover image" },
      { status: 500 }
    );
  }
}
