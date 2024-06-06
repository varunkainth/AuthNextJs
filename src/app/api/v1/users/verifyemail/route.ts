import { connect } from "@/db/dbconnect";
import User from "@/model/user.model";
import { sendemail } from "@/utils/mailers";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(req: NextRequest) {

  
  try {
    const reqBody = await req.json();
    const { token } = reqBody;

    if (!token) {
      throw new Error("No token provided");
    }

    const user = await User.findOne({
      verifytoken: token,
      verifytokenexpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verifytoken = undefined;
    user.verifytokenexpiry = undefined;

    await user.save();

    await sendemail({
      email: user.email,
      emailType: "welcome",
      userId: user._id,
    });

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
