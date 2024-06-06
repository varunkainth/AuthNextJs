import { connect } from "@/db/dbconnect";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(req: NextRequest) {
  try {
    console.log("Content-Type:", req.headers.get("Content-Type"));
    console.log("Request method:", req.method);
    const reqBody = await req.json();
    const { email, password } = reqBody;
    console.log(reqBody);
    console.log(email);
    console.log(password);

    if (!email) {
      return NextResponse.json({
        error: "Enter an email address",
      });
    }
    if (!password) {
      return NextResponse.json({ error: "Enter the password" });
    }

    const user = await User.findOne({ email });

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
    console.log("Token data:", tokenData);

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: process.env.TOKEN_EXPIRY!,
    });
    if (!token) {
      console.log("no token is generated");
    }
    console.log("Generated token:", token);

    const response = NextResponse.json(
      { message: "User logged in successfully", user },
      { status: 200 }
    );
    console.log(token);
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
