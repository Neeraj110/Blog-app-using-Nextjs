import { uploadToCloudinary } from "@/lib/cloudinary";
import { User } from "@/models/user.model";
import { OTP } from "@/models/otp.Model";
import { connectDB } from "@/lib/connectDB";

// Delete unverified user and associated OTP
async function deleteUnverifiedUser(email) {
  try {
    await connectDB();
    await User.deleteOne({ email, isVerified: false });
    await OTP.deleteOne({ email });
  } catch (error) {
    console.error("Error deleting unverified user:", error);
  }
}

// Check if OTP is expired
function isOtpExpired(otpCreationTime, maxHours = 1) {
  const currentTime = new Date();
  const timeDifference = currentTime - otpCreationTime;
  const hoursDifference = timeDifference / (1000 * 60 * 60);
  return hoursDifference > maxHours;
}

const handleFileUpload = async (file, folder) => {
  if (!file) {
    throw new Error("No file provided");
  }

  // Handle file size validation
  const isVideo = file.type.startsWith("video/");
  const maxSize = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024; // 100MB for video, 5MB for images

  try {
    const buffer = await file.arrayBuffer();

    if (buffer.byteLength > maxSize) {
      throw new Error(
        `File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
      );
    }

    const fileObj = {
      buffer: Buffer.from(buffer),
      type: file.type,
    };

    const result = await uploadToCloudinary(fileObj, folder);

    if (!result || !result.url) {
      throw new Error("Failed to upload file to Cloudinary");
    }

    return result;
  } catch (error) {
    console.error("File upload error:", error);
    throw error;
  }
};

// Validate user update data with comprehensive rules
const validateUserUpdateData = (data) => {
  const errors = {};

  // Name validation
  if (data.name && (data.name.length < 2 || data.name.length > 25)) {
    errors.name = "Name must be between 2 and 25 characters";
  }

  // Bio/About validation
  if (data.description?.about && data.description.about.length > 160) {
    errors.about = "Bio cannot exceed 160 characters";
  }

  // Location validation
  if (data.description?.location && data.description.location.length > 30) {
    errors.location = "Location cannot exceed 30 characters";
  }

  // URL validation
  if (data.description?.link) {
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlPattern.test(data.description.link)) {
      errors.link = "Please enter a valid URL";
    }
  }

  // Date of birth validation if provided
  if (data.description?.dob) {
    const dobDate = new Date(data.description.dob);
    const now = new Date();
    const minAge = new Date(
      now.getFullYear() - 13,
      now.getMonth(),
      now.getDate()
    );

    if (isNaN(dobDate.getTime())) {
      errors.dob = "Please enter a valid date";
    } else if (dobDate > minAge) {
      errors.dob = "User must be at least 13 years old";
    }
  }

  // Media file validation (if needed)
  if (data.avatar) {
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedImageTypes.includes(data.avatar.type)) {
      errors.avatar =
        "Please upload a valid image file (JPG, PNG, GIF, or WebP)";
    }
  }

  if (data.coverImg) {
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedImageTypes.includes(data.coverImg.type)) {
      errors.coverImg =
        "Please upload a valid image file (JPG, PNG, GIF, or WebP)";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export {
  deleteUnverifiedUser,
  isOtpExpired,
  handleFileUpload,
  validateUserUpdateData,
};
