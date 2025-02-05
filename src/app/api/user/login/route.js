import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Connect to the database
    await connectDB();

    // Find the user by email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the password
    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return NextResponse.json({ error: "User not verified" }, { status: 403 });
    }

    // Generate JWT token
    const token = await user.generateAccessToken();

    // Set the token as an HTTP-only cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: user.toSafeObject(),
    });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: true, 
      maxAge: 60 * 60 * 10, // 10 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
