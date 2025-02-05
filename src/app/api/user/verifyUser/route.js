import { NextResponse } from "next/server";
import { deleteUnverifiedUser, isOtpExpired } from "@/helper/userHelpers";
import { OTP } from "@/models/otp.Model";
import { User } from "@/models/user.model";
import { connectDB } from "@/lib/connectDB";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    await connectDB();

    // Find OTP
    const existingOTP = await OTP.findOne({ otp });
    if (!existingOTP) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (isOtpExpired(existingOTP.createdAt)) {
      await deleteUnverifiedUser(email);
      return NextResponse.json(
        { error: "OTP has expired. Please register again." },
        { status: 400 }
      );
    }

    // Verify user
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    // Clean up OTP
    await OTP.deleteOne({ email, otp });

    return NextResponse.json({
      message: "User verified successfully.",
      data: user.toSafeObject(),
    });
  } catch (error) {
    console.error("Error in user verification:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
