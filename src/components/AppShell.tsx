"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Files, CalendarDays, WandSparkles, ChartNoAxesCombined, Layers3, Settings2, PanelLeftClose, Menu, ArrowUpRight, Plus, ChevronDown, LogOut, CircleHelp } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import BrandMark from "@/components/BrandMark";
import type { UserInfo } from "@/lib/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
const nav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/content", icon: Files, label: "Content library" },
  { href: "/calendar", icon: CalendarDays, label: "Content calendar" },
  { href: "/studio", icon: WandSparkles, label: "AI Studio", accent: true },
  { href: "/analytics", icon: ChartNoAxesCombined, label: "Analytics" },
  { href: "/brands", icon: Layers3, label: "Brand workspaces" },
];
export default function AppShell({ children, user }: { children: React.ReactNode; user: UserInfo }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { workspaces, selectedId, workspace, selectWorkspace, error } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const logout = async () => {
    try { await api("/api/auth/logout", { method: "POST" }); router.replace("/login"); router.refresh(); }
    catch { toast.error("Could not sign out"); }
  };
  return <div className="app-frame">
    {mobileOpen && <button className="mobile-backdrop" aria-label="Close menu" onClick={() => setMobileOpen(false)}/>}
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="sidebar-logo"><Link href="/dashboard" onClick={() => setMobileOpen(false)}><BrandMark/></Link><button className="only-mobile icon-button" onClick={() => setMobileOpen(false)} aria-label="Close menu"><PanelLeftClose size={19}/></button></div>
      <div className="sidebar-section-caption">WORKSPACE</div>
      <div className="workspace-select-wrap"><span className="workspace-bubble" style={{ background: workspace?.color || "#b79aff" }}>{workspace?.name?.[0]?.toUpperCase() || "V"}</span><select aria-label="Choose brand" className="workspace-select" value={selectedId} onChange={(e) => selectWorkspace(e.target.value)}>{workspaces.length ? workspaces.map((w) => <option value={w.id} key={w.id}>{w.name}</option>) : <option value="">No brands yet</option>}</select><ChevronDown size={15}/></div>
      <div className="sidebar-section-caption nav-section">WORKSPACE TOOLS</div>
      <nav className="side-nav">{nav.map(({ href, icon: Icon, label, accent }) => <Link key={href} href={href} className={`nav-item ${pathname === href ? "active" : ""}`} onClick={() => setMobileOpen(false)}><Icon size={19}/><span>{label}</span>{accent && <span className="nav-new">NEW</span>}</Link>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-guide"><div className="guide-icon"><WandSparkles size={20}/></div><strong>Make something great.</strong><p>Your next campaign starts with one good idea.</p><Link href="/studio">Open studio <ArrowUpRight size={14}/></Link></div>
        <Link className={`nav-item ${pathname === "/settings" ? "active" : ""}`} href="/settings" onClick={() => setMobileOpen(false)}><Settings2 size={19}/> Settings</Link>
        <a className="nav-item" href="https://github.com" target="_blank" rel="noopener noreferrer"><CircleHelp size={19}/> Developer resources <ArrowUpRight size={15}/></a>
        <div className="sidebar-user"><div className="avatar">{user.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("")}</div><div className="user-lines"><strong>{user.name}</strong><small>{user.email}</small></div><button aria-label="Sign out" title="Sign out" onClick={logout}><LogOut size={17}/></button></div>
      </div>
    </aside>
    <main className="app-main"><header className="app-topbar"><div className="topbar-left"><button aria-label="Open navigation" className="only-mobile icon-button" onClick={() => setMobileOpen(true)}><Menu size={23}/></button><span className="topbar-dot"/><span>Workspace</span><span className="topbar-slash">/</span><strong>{nav.find((n) => n.href === pathname)?.label || "Settings"}</strong></div><div className="topbar-right"><span className="live-pill"><span/> All systems ready</span><Link href="/content?new=1" className="button button-primary button-small"><Plus size={16}/> New content</Link></div></header>
      <div className="page-container">{error && <div className="global-error">{error}</div>}{children}</div>
    </main>
  </div>;
}
