import { connect } from "@/db/dbconnect";
import User from "@/model/user.model";
import { DataFromToken } from "@/utils/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req: NextRequest) {
  try {
    const userid = await DataFromToken(req);
    const user = await User.findById(userid).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }
    return NextResponse.json({ messageL: "User Found", data: user });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
