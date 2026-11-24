import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validation";
import { createToken, setSessionCookie } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/http";
export async function POST(req: Request) {
  try {
    const data = loginSchema.parse(await req.json());
    await connectDB();
    const user = await User.findOne({ email: data.email });
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) return jsonError("Incorrect email or password", 401);
    const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
    setSessionCookie(response, await createToken({ userId: user.id, name: user.name, email: user.email }));
    return response;
  } catch (error) { return handleApiError(error); }
}
