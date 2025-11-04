import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/user.model";
import { sendVerificationEmail } from "@/lib/sendEmails";
import { OTP } from "@/models/otp.Model";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, username, password } = body;

    await connectDB();

    if (await User.findOne({ email })) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    if (await User.findOne({ username })) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    await OTP.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.create({
      email,
      otp,
      name,
      username,
      password,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendVerificationEmail({ email, name, otp });

    return NextResponse.json({
      message: "Registration successful, OTP sent to your email.",
      status: 200,
    });
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
