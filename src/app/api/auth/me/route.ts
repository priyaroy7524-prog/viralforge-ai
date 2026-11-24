import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { jsonError } from "@/lib/http";
export async function GET() {
  const session = await getSession();
  return session ? NextResponse.json({ user: session }) : jsonError("Not authenticated", 401);
}
