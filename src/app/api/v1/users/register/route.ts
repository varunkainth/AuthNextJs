import { connect } from "@/db/dbconnect";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendemail } from "@/utils/mailers";

connect();

export async function POST(req: NextRequest) {
  try {
    const reqbody = await req.json();
    const { username, email, password } = reqbody;
    // console.log(reqbody);

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { Error: "User Already exist .... ", data: user },
        { status: 400 }
      );
    }
    const salt = await bcryptjs.genSalt(15);
    const hashedpassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedpassword,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);

    // send verification email

    await sendemail({
      email,
      emailType: "verification",
      userId: savedUser._id,
    });

    return NextResponse.json({
      message: "User Registered Successfully",
      success: true,
      data: savedUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
