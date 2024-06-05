import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const DataFromToken = (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value || "";
    const decodeToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    return decodeToken.id;
  } catch (error: any) {
    throw new Error(error);
  }
};
