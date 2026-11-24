import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { NextResponse } from "next/server";

const COOKIE = "vf_session";
const WEEK = 7 * 24 * 60 * 60;

function getSecret(): Uint8Array {
  const raw = process.env.SESSION_SECRET;
  if (!raw || raw.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");
  return new TextEncoder().encode(raw);
}
export type Session = { userId: string; name: string; email: string };

export async function createToken(user: Session) {
  return new SignJWT({ name: user.name, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}
export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: WEEK,
  });
}
export function deleteSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE, "", { path: "/", httpOnly: true, maxAge: 0 });
}
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    if (!payload.sub || typeof payload.email !== "string" || typeof payload.name !== "string") return null;
    return { userId: payload.sub, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}
