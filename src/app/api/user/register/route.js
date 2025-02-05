import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/user.model";
import { sendVerificationEmail } from "@/lib/sendEmails";
import { OTP } from "@/models/otp.Model";

// api/user/register
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, username, password } = body;

    // Connect to the database
    await connectDB();

    // Check for existing user by email
    if (await User.findOne({ email })) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      username,
      password,
      isVerified: false,
    });

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the OTP to the database
    await OTP.create({ email, otp });

    // Send the OTP to the user's email
    await sendVerificationEmail({ email, name, otp });

    // Respond with a success message
    return NextResponse.json({
      message: "Registration successful, OTP sent.",
      data: newUser.toSafeObject(),
      status: 201,
    });
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
