import { connect } from "@/db/dbconnect";
import User from "@/model/user.model";
import { sendemail } from "@/utils/mailers";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { token } = reqBody;
    console.log(token);
    if (!token) {
      throw new Error("No Token is Get");
    }

    const user = await User.findOne({
      verifytoken: token,
      verifytokenexpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invaild token" }, { status: 400 });
    }

    console.log(user);

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
      { message: "Email is Verified sucessfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
