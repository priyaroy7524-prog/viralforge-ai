"use client";
import { CalendarDays, Pencil, ArrowUpRight, Hash } from "lucide-react";
import type { ContentPost } from "@/lib/types";
import { PlatformBadge, StatusBadge } from "@/components/UI";
import { format } from "date-fns";
export default function PostTile({ post, onEdit }: { post: ContentPost; onEdit: (p: ContentPost) => void }) {
  return <article className="post-tile"><div className="post-tile-top"><PlatformBadge platform={post.platform}/><StatusBadge status={post.status}/></div><div className="post-tile-body"><div className="post-type">{post.type.toUpperCase()} / CONTENT</div><h3>{post.title}</h3><p>{post.hook || post.caption || "Add a hook or caption to bring this idea to life."}</p></div><div className="post-tag-line">{post.tags.slice(0, 3).map((tag) => <span key={tag}><Hash size={11}/>{tag}</span>)}</div><div className="post-tile-footer"><span><CalendarDays size={15}/>{post.scheduledFor ? format(new Date(post.scheduledFor), "MMM d, yyyy") : "No planned date"}</span><button className="tile-edit" aria-label={`Edit ${post.title}`} onClick={() => onEdit(post)}><Pencil size={15}/> Edit <ArrowUpRight size={14}/></button></div></article>;
}
