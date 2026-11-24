"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { ContentPost, Workspace } from "@/lib/types";

type ContextValue = {
  workspaces: Workspace[];
  selectedId: string;
  workspace: Workspace | undefined;
  posts: ContentPost[];
  loading: boolean;
  error: string;
  selectWorkspace: (id: string) => void;
  refreshWorkspaces: () => Promise<void>;
  refreshPosts: () => Promise<void>;
};
const Context = createContext<ContextValue | null>(null);
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error("useApp requires an AppProvider");
  return value;
}
export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refreshWorkspaces = useCallback(async () => {
    try {
      const data = await api<{ workspaces: Workspace[] }>("/api/workspaces");
      setWorkspaces(data.workspaces);
      setSelectedId((previous) => {
        const stored = typeof window !== "undefined" ? localStorage.getItem("vf_brand") : null;
        const preferred = previous || stored;
        return data.workspaces.some((w) => w.id === preferred) ? preferred! : data.workspaces[0]?.id || "";
      });
      setError("");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not load brands"); }
    finally { setLoading(false); }
  }, []);
  const refreshPosts = useCallback(async () => {
    if (!selectedId) { setPosts([]); return; }
    try {
      const data = await api<{ posts: ContentPost[] }>(`/api/posts?workspaceId=${encodeURIComponent(selectedId)}`);
      setPosts(data.posts);
      setError("");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not load posts"); }
  }, [selectedId]);
  useEffect(() => { void refreshWorkspaces(); }, [refreshWorkspaces]);
  useEffect(() => { void refreshPosts(); }, [refreshPosts]);
  useEffect(() => { if (selectedId) localStorage.setItem("vf_brand", selectedId); }, [selectedId]);
  return <Context.Provider value={{ workspaces, selectedId, workspace: workspaces.find((w) => w.id === selectedId), posts, loading, error, selectWorkspace: setSelectedId, refreshWorkspaces, refreshPosts }}>{children}</Context.Provider>;
}
