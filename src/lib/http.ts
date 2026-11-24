import { NextResponse } from "next/server";
import { ZodError } from "zod";
export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
export function handleApiError(error: unknown) {
  if (error instanceof ZodError) return jsonError(error.issues[0]?.message || "Invalid input", 422);
  if (error instanceof Error && /MONGODB_URI|ECONNREFUSED|Server selection timed out/.test(error.message)) {
    return jsonError("Database unavailable. Check your MongoDB connection.", 503);
  }
  console.error("API request failed", error);
  return jsonError("Something went wrong. Try again.", 500);
}
export function validId(id: string): boolean { return /^[a-fA-F0-9]{24}$/.test(id); }
