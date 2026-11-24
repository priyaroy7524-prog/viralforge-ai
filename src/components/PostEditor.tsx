"use client";
import { useEffect, useState } from "react";
import { X, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/components/AppProvider";
import { api } from "@/lib/api";
import type { ContentPost, Platform, PostPayload, PostType, Status } from "@/lib/types";
import { platforms, statuses, types } from "@/lib/types";

type Props = { open: boolean; onClose: () => void; editing?: ContentPost | null; initialDate?: Date | null };
const blank = (workspaceId: string): PostPayload => ({ workspaceId, title: "", caption: "", hook: "", platform: "Instagram", type: "post", status: "idea", scheduledFor: null, tags: [] });
export default function PostEditor({ open, onClose, editing, initialDate }: Props) {
  const { selectedId, refreshPosts } = useApp();
  const [form, setForm] = useState<PostPayload>(() => blank(selectedId));
  const [tagText, setTagText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (open) {
      const current = editing ? { workspaceId: editing.workspaceId, title: editing.title, caption: editing.caption, hook: editing.hook, platform: editing.platform, type: editing.type, status: editing.status, scheduledFor: editing.scheduledFor, tags: editing.tags } : blank(selectedId);
      if (!editing && initialDate) { current.scheduledFor = initialDate.toISOString(); current.status = "scheduled"; }
      setForm(current);
      setTagText(current.tags.join(", "));
    }
  }, [open, editing, selectedId, initialDate]);
  if (!open) return null;
  const set = <K extends keyof PostPayload>(key: K, value: PostPayload[K]) => setForm((f) => ({ ...f, [key]: value }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return toast.error("Create a brand workspace first");
    setSubmitting(true);
    try {
      const payload = { ...form, workspaceId: selectedId, tags: tagText.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean).slice(0, 12) };
      await api(editing ? `/api/posts/${editing.id}` : "/api/posts", { method: editing ? "PATCH" : "POST", body: JSON.stringify(payload) });
      await refreshPosts();
      toast.success(editing ? "Content updated" : "Content created");
      onClose();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Could not save post"); }
    finally { setSubmitting(false); }
  };
  const remove = async () => {
    if (!editing || !window.confirm(`Delete “${editing.title}”?`)) return;
    setSubmitting(true);
    try { await api(`/api/posts/${editing.id}`, { method: "DELETE" }); await refreshPosts(); toast.success("Content deleted"); onClose(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Could not delete post"); }
    finally { setSubmitting(false); }
  };
  const localDate = form.scheduledFor ? new Date(new Date(form.scheduledFor).getTime() - new Date(form.scheduledFor).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";
  return <div className="modal-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><div className="modal-window" role="dialog" aria-modal="true" aria-label="Content editor">
    <div className="modal-top"><div><div className="eyebrow">CONTENT LIBRARY</div><h2>{editing ? "Edit content" : "Create new content"}</h2></div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={20}/></button></div>
    <form onSubmit={submit} className="editor-form"><div className="field"><label htmlFor="post-title">Content title</label><input id="post-title" required minLength={2} maxLength={140} value={form.title} placeholder="E.g. Monday motivation reel" onChange={(e) => set("title", e.target.value)}/></div>
      <div className="form-grid"><div className="field"><label>Platform</label><select value={form.platform} onChange={(e) => set("platform", e.target.value as Platform)}>{platforms.map((p) => <option key={p}>{p}</option>)}</select></div><div className="field"><label>Format</label><select value={form.type} onChange={(e) => set("type", e.target.value as PostType)}>{types.map((t) => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}</select></div></div>
      <div className="field"><label>Opening hook</label><input value={form.hook} maxLength={400} onChange={(e) => set("hook", e.target.value)} placeholder="Stop scrolling, this changes everything..."/></div>
      <div className="field"><label>Caption / script</label><textarea rows={6} maxLength={5000} value={form.caption} onChange={(e) => set("caption", e.target.value)} placeholder="Write your content here..."/></div>
      <div className="field"><label>Tags <small>(comma separated)</small></label><input value={tagText} onChange={(e) => setTagText(e.target.value)} placeholder="marketing, storytelling, growth"/></div>
      <div className="form-grid"><div className="field"><label>Status</label><select value={form.status} onChange={(e) => set("status", e.target.value as Status)}>{statuses.map((s) => <option value={s} key={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}</select></div><div className="field"><label>Planned date</label><input type="datetime-local" value={localDate} onChange={(e) => set("scheduledFor", e.target.value ? new Date(e.target.value).toISOString() : null)}/></div></div>
      <div className="editor-footer">{editing ? <button className="button button-danger-ghost" type="button" onClick={remove} disabled={submitting}><Trash2 size={16}/> Delete</button> : <span className="form-hint">Saved securely in your workspace.</span>}<div className="editor-footer-actions"><button className="button button-ghost" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit" disabled={submitting}><Save size={16}/>{submitting ? "Saving..." : editing ? "Save changes" : "Create content"}</button></div></div>
    </form>
  </div></div>;
}
