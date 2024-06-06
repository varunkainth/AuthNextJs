import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const dataFromToken = (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      throw new Error("Token not found");
    }

    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET!) as {
      id: string;
    };
    return decodeToken.id;
  } catch (error) {
    console.error("Error decoding token:", error);
    // Return null or handle the error as needed
  }
};
