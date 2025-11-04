import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { OTP } from "@/models/otp.Model";
import { User } from "@/models/user.model";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const existingOTP = await OTP.findOne({ email, otp });
    if (!existingOTP) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await OTP.deleteOne({ email });
      return NextResponse.json(
        { error: "Email already registered. Please login instead." },
        { status: 400 }
      );
    }

    const existingUsername = await User.findOne({
      username: existingOTP.username,
    });
    if (existingUsername) {
      await OTP.deleteOne({ email });
      return NextResponse.json(
        {
          error:
            "Username is no longer available. Please register again with a different username.",
        },
        { status: 400 }
      );
    }

    const { name, username, password } = existingOTP;
    const user = await User.create({
      name,
      email,
      username,
      password,
      isVerified: true,
    });

    await OTP.deleteOne({ email });

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      isVerified: user.isVerified,
    };

    return NextResponse.json({
      message: "User verified and registered successfully.",
      data: safeUser,
    });
  } catch (error) {
    console.error("Error in user verification:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
