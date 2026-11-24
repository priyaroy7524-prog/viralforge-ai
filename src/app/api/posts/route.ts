import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { Workspace } from "@/models/Workspace";
import { postSchema } from "@/lib/validation";
import { handleApiError, jsonError, validId } from "@/lib/http";
import type { IPost } from "@/models/Post";
function serialize(p: IPost) {
  return { id: String(p._id), workspaceId: String(p.workspaceId), title: p.title, caption: p.caption,
    hook: p.hook, platform: p.platform, type: p.type, status: p.status,
    scheduledFor: p.scheduledFor?.toISOString() || null, tags: p.tags, createdAt: p.createdAt?.toISOString(), updatedAt: p.updatedAt?.toISOString() };
}
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return jsonError("Not authenticated", 401);
  try {
    const url = new URL(req.url);
    const workspaceId = url.searchParams.get("workspaceId");
    if (workspaceId && !validId(workspaceId)) return jsonError("Invalid brand", 400);
    await connectDB();
    if (workspaceId && !(await Workspace.exists({ _id: workspaceId, ownerId: session.userId }))) return jsonError("Brand not found", 404);
    const posts = await Post.find({ ownerId: session.userId, ...(workspaceId ? { workspaceId } : {}) }).sort({ createdAt: -1 }).limit(500).lean();
    return NextResponse.json({ posts: posts.map((p) => serialize(p)) });
  } catch (error) { return handleApiError(error); }
}
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return jsonError("Not authenticated", 401);
  try {
    const data = postSchema.parse(await req.json());
    await connectDB();
    if (!(await Workspace.exists({ _id: data.workspaceId, ownerId: session.userId }))) return jsonError("Brand not found", 404);
    const post = await Post.create({ ...data, ownerId: session.userId });
    return NextResponse.json({ post: serialize(post) }, { status: 201 });
  } catch (error) { return handleApiError(error); }
}
