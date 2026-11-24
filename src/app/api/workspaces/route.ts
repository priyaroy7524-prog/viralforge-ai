import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Workspace } from "@/models/Workspace";
import { workspaceSchema } from "@/lib/validation";
import { handleApiError, jsonError } from "@/lib/http";
export async function GET() {
  const session = await getSession();
  if (!session) return jsonError("Not authenticated", 401);
  try {
    await connectDB();
    const workspaces = await Workspace.find({ ownerId: session.userId }).sort({ createdAt: 1 }).lean();
    return NextResponse.json({ workspaces: workspaces.map((w) => ({ id: String(w._id), name: w.name, industry: w.industry, tone: w.tone, color: w.color, createdAt: w.createdAt })) });
  } catch (error) { return handleApiError(error); }
}
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return jsonError("Not authenticated", 401);
  try {
    const data = workspaceSchema.parse(await req.json());
    await connectDB();
    if ((await Workspace.countDocuments({ ownerId: session.userId })) >= 10) return jsonError("Maximum 10 brands per account", 400);
    const w = await Workspace.create({ ...data, ownerId: session.userId });
    return NextResponse.json({ workspace: { id: w.id, name: w.name, industry: w.industry, tone: w.tone, color: w.color, createdAt: w.createdAt } }, { status: 201 });
  } catch (error) { return handleApiError(error); }
}
