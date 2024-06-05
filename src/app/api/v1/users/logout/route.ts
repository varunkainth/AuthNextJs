import { connect } from "@/db/dbconnect";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req: NextRequest) {
  try {
    const res = NextResponse.json({
      message: "Logout Successfully",
      success: true,
    });

    res.cookies.delete("token");
    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
