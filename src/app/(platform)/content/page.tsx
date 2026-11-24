"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Plus, Filter, ArrowDownWideNarrow } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { PageHeading, EmptyState } from "@/components/UI";
import PostEditor from "@/components/PostEditor";
import PostTile from "@/components/PostTile";
import type { ContentPost } from "@/lib/types";
function Library() {
  const { posts, loading } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [newOpen, setNewOpen] = useState(false);
  const [editing, setEditing] = useState<ContentPost | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [platform, setPlatform] = useState("all");
  useEffect(() => { if (searchParams.get("new") === "1") { setNewOpen(true); router.replace("/content", { scroll: false }); } }, [searchParams, router]);
  const filtered = useMemo(() => posts.filter((p) => (status === "all" || p.status === status) && (platform === "all" || p.platform === platform) && [p.title, p.caption, p.hook].some((v) => v.toLowerCase().includes(search.toLowerCase()))), [posts, status, platform, search]);
  return <><PageHeading eyebrow="YOUR IDEAS, ALL IN ONE PLACE" title="Content library" description="Every campaign, every creative spark, beautifully organized." action={<button className="button button-primary" onClick={() => setNewOpen(true)}><Plus size={18}/> New content</button>}/><div className="library-toolbar"><div className="library-search"><Search size={18}/><input aria-label="Search content" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, hook or caption..."/></div><div className="toolbar-select"><Filter size={16}/><select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option>{["idea","draft","scheduled","published"].map((s)=><option key={s} value={s}>{s[0].toUpperCase()+s.slice(1)}</option>)}</select></div><div className="toolbar-select"><ArrowDownWideNarrow size={16}/><select aria-label="Filter by platform" value={platform} onChange={(e) => setPlatform(e.target.value)}><option value="all">All platforms</option>{["Instagram","LinkedIn","X","TikTok"].map((p)=><option key={p}>{p}</option>)}</select></div></div><div className="library-count">SHOWING <strong>{filtered.length}</strong> OF {posts.length} PIECES</div>{filtered.length ? <div className="post-grid">{filtered.map((p)=><PostTile key={p.id} post={p} onEdit={setEditing}/>)}</div> : loading ? <div className="loading-message">Loading your content...</div> : <EmptyState title={posts.length ? "No matching content" : "Your next big idea goes here"} text={posts.length ? "Try another search or clear your filters." : "Add a post, reel, carousel or idea to start organizing your content."}/>}<PostEditor open={newOpen || !!editing} editing={editing} onClose={() => { setNewOpen(false); setEditing(null); }}/></>;
}
export default function ContentPage() { return <Suspense fallback={<div className="loading-message">Loading content library...</div>}><Library/></Suspense>; }
