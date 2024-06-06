import { connect } from "@/db/dbconnect";
import User from "@/model/user.model";
import { dataFromToken } from "@/utils/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req: NextRequest) {
  try {
    const userid = await dataFromToken(req);
    const user = await User.findById(userid).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User Found", data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
