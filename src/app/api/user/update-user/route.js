import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/user.model";
import { handleFileUpload } from "@/helper/userHelpers";
import { validateUserUpdateData } from "@/helper/userHelpers";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function PATCH(req) {
  try {
    await connectDB();

    // Get user ID from headers (set by middleware)
    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Find existing user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse form data
    const formData = await req.formData();

    // Prepare update data with proper fallbacks
    const updateData = {
      name: formData.get("name") || user.name,
      description: {
        about: formData.get("about") || user.description?.about || "",
        location: formData.get("location") || user.description?.location || "",
        link: formData.get("link") || user.description?.link || "",
        dob: formData.get("dob")
          ? new Date(formData.get("dob"))
          : user.description?.dob || null,
      },
    };

    // Validate update data
    const { isValid, errors } = validateUserUpdateData(updateData);
    if (!isValid) {
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 }
      );
    }

    // Handle avatar upload
    const avatarFile = formData.get("avatar");
    if (avatarFile) {
      try {
        // Delete existing avatar if it exists
        if (user.avatar) {
          await deleteFromCloudinary(user.avatar).catch((error) => {
            console.error("Error deleting old avatar:", error);
          });
        }

        const avatarResult = await handleFileUpload(avatarFile, "avatars");
        if (avatarResult?.url) {
          updateData.avatar = avatarResult.url;
        }
      } catch (error) {
        console.error("Avatar upload error:", error);
        return NextResponse.json(
          { error: "Error uploading avatar" },
          { status: 400 }
        );
      }
    }

    // Handle cover image upload
    const coverFile = formData.get("coverImg");
    if (coverFile) {
      try {
        // Delete existing cover image if it exists
        if (user.coverImg) {
          await deleteFromCloudinary(user.coverImg).catch((error) => {
            console.error("Error deleting old cover image:", error);
          });
        }

        const coverResult = await handleFileUpload(coverFile, "covers");
        if (coverResult?.url) {
          updateData.coverImg = coverResult.url;
        }
      } catch (error) {
        console.error("Cover image upload error:", error);
        return NextResponse.json(
          { error: "Error uploading cover image" },
          { status: 400 }
        );
      }
    }

    // Update user with validation and sanitization
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        select: "-password",
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser.toSafeObject(),
    });
  } catch (error) {
    console.error("Profile update error:", error);

    // Handle specific errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred while updating profile" },
      { status: 500 }
    );
  }
}

// Config for handling file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
