import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { Workspace } from "@/models/Workspace";
import { postSchema } from "@/lib/validation";
import { handleApiError, jsonError, validId } from "@/lib/http";
type Ctx = { params: Promise<{ id: string }> };
export async function PATCH(req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return jsonError("Not authenticated", 401);
  const { id } = await ctx.params;
  if (!validId(id)) return jsonError("Invalid post", 400);
  try {
    const data = postSchema.parse(await req.json());
    await connectDB();
    if (!(await Workspace.exists({ _id: data.workspaceId, ownerId: session.userId }))) return jsonError("Brand not found", 404);
    const post = await Post.findOneAndUpdate({ _id: id, ownerId: session.userId }, { $set: data }, { new: true, runValidators: true });
    if (!post) return jsonError("Post not found", 404);
    return NextResponse.json({ post: { id: post.id } });
  } catch (error) { return handleApiError(error); }
}
export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return jsonError("Not authenticated", 401);
  const { id } = await ctx.params;
  if (!validId(id)) return jsonError("Invalid post", 400);
  try {
    await connectDB();
    const post = await Post.findOneAndDelete({ _id: id, ownerId: session.userId });
    if (!post) return jsonError("Post not found", 404);
    return NextResponse.json({ ok: true });
  } catch (error) { return handleApiError(error); }
}
