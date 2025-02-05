import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logout successful" });

    // Clear the cookie
    response.cookies.set("authToken", "", {
      httpOnly: true,
      secure: true,
      maxAge: 0,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.error({
      error: error,
      message: "Something went wrong",
      status: 500,
    });
  }
}
