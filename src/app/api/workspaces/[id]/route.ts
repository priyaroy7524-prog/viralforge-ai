import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Workspace } from "@/models/Workspace";
import { Post } from "@/models/Post";
import { workspaceSchema } from "@/lib/validation";
import { handleApiError, jsonError, validId } from "@/lib/http";
type Ctx = { params: Promise<{ id: string }> };
export async function PATCH(req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return jsonError("Not authenticated", 401);
  const { id } = await ctx.params;
  if (!validId(id)) return jsonError("Invalid brand", 400);
  try {
    const data = workspaceSchema.partial().parse(await req.json());
    await connectDB();
    const w = await Workspace.findOneAndUpdate({ _id: id, ownerId: session.userId }, { $set: data }, { new: true });
    if (!w) return jsonError("Brand not found", 404);
    return NextResponse.json({ workspace: { id: w.id, name: w.name, industry: w.industry, tone: w.tone, color: w.color, createdAt: w.createdAt } });
  } catch (error) { return handleApiError(error); }
}
export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return jsonError("Not authenticated", 401);
  const { id } = await ctx.params;
  if (!validId(id)) return jsonError("Invalid brand", 400);
  try {
    await connectDB();
    const w = await Workspace.findOneAndDelete({ _id: id, ownerId: session.userId });
    if (!w) return jsonError("Brand not found", 404);
    await Post.deleteMany({ workspaceId: id, ownerId: session.userId });
    return NextResponse.json({ ok: true });
  } catch (error) { return handleApiError(error); }
}
