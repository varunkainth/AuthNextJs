import { connect } from "@/db/dbconnect";
import User from "@/model/user.model";
import { sendemail } from "@/utils/mailers";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { token, newPassword } = reqBody;

    if (!token) {
      throw new Error("No token provided");
    }

    if (!newPassword) {
      throw new Error("No new password provided");
    }
    
    const user = await User.findOne({
      resettoken: token,
      resettokenexpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 15);

    user.password = hashedPassword;
    user.resettoken = undefined;
    user.resettokenexpiry = undefined;

    await user.save();
    await sendemail({
        email: user.email,
        emailType: "welcome",
        userId: user._id,
      });
    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
