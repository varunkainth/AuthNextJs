import { connect } from "@/db/dbconnect";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(req: NextRequest) {
  try {
    const { username, password, email } = await req.json();
    if (username || !email) {
      return NextResponse.json({
        error: "enter atleast username or email address",
      });
    }
    if (!password) {
      return NextResponse.json({ error: "Enter the password" });
    }

    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      throw new Error("User Not Found");
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Password Is Invaild");
    }
    const tokenData = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: process.env.TOKEN_SECRET_EXPIRY!,
    });

    const response = NextResponse.json(
      { Message: "User Login Successfully", user },
      { status: 200 }
    );
    response.cookies.set("token", token, { httpOnly: true, secure: true });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
    console.log(error);
  }
}
