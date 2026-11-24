import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Workspace } from "@/models/Workspace";
import { signupSchema } from "@/lib/validation";
import { createToken, setSessionCookie } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/http";
export async function POST(req: Request) {
  try {
    const data = signupSchema.parse(await req.json());
    await connectDB();
    if (await User.exists({ email: data.email })) return jsonError("Email is already registered", 409);
    const user = await User.create({ name: data.name, email: data.email, passwordHash: await bcrypt.hash(data.password, 12) });
    await Workspace.create({ ownerId: user._id, name: "My first brand", industry: "Marketing", tone: "Confident", color: "#b79aff" });
    const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
    setSessionCookie(response, await createToken({ userId: user.id, name: user.name, email: user.email }));
    return response;
  } catch (error: unknown) {
    if (typeof error === "object" && error && "code" in error && error.code === 11000) return jsonError("Email is already registered", 409);
    return handleApiError(error);
  }
}
