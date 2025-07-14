import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/user.model";
import { handleFileUpload, validateUserUpdateData } from "@/helper/userHelpers";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { cacheService } from "@/helper/cacheData";

export async function PATCH(req) {
  try {
    await connectDB();

    const userId = req.headers.get("userId");
    if (!userId)
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const formData = await req.formData();
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

    const { isValid, errors } = validateUserUpdateData(updateData);
    if (!isValid)
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 }
      );

    const avatarFile = formData.get("avatar");
    if (avatarFile) {
      try {
        if (user.avatar) await deleteFromCloudinary(user.avatar);
        const avatarResult = await handleFileUpload(avatarFile, "avatars");
        if (avatarResult?.url) updateData.avatar = avatarResult.url;
      } catch {
        return NextResponse.json(
          { error: "Error uploading avatar" },
          { status: 400 }
        );
      }
    }

    const coverFile = formData.get("coverImg");
    if (coverFile) {
      try {
        if (user.coverImg) await deleteFromCloudinary(user.coverImg);
        const coverResult = await handleFileUpload(coverFile, "covers");
        if (coverResult?.url) updateData.coverImg = coverResult.url;
      } catch {
        return NextResponse.json(
          { error: "Error uploading cover image" },
          { status: 400 }
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        select: "-password",
      }
    );

    if (!updatedUser)
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );

    cacheService.setUserProfile(userId, updatedUser.toObject());

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating profile" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
