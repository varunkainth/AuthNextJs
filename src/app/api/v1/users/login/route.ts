import { connect } from "@/db/dbconnect";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(req: NextRequest) {
  try {
    const { username, password, email } = await req.json();

    if (!username && !email) {
      return NextResponse.json({
        error: "Enter at least username or email address",
      });
    }
    if (!password) {
      return NextResponse.json({ error: "Enter the password" });
    }

    let user;

    if (email) {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ username });
    }

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const tokenData = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: process.env.TOKEN_EXPIRY,
    });

    const response = NextResponse.json(
      { message: "User logged in successfully", user },
      { status: 200 }
    );

    response.cookies.set("token", token, { httpOnly: true, secure: true });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
