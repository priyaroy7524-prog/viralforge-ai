import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, FilePlus2 } from "lucide-react";
import type { Status, Platform } from "@/lib/types";
export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <div className="heading-action">{action}</div>}</div>;
}
export function StatusBadge({ status }: { status: Status }) { return <span className={`status-badge status-${status}`}><span/>{status[0].toUpperCase() + status.slice(1)}</span>; }
export function PlatformBadge({ platform }: { platform: Platform }) { return <span className={`platform-badge platform-${platform.toLowerCase()}`}>{platform}</span>; }
export function EmptyState({ title = "Nothing here yet", text = "Create your first piece of content to get started.", href = "/content?new=1", buttonText = "Create content" }: { title?: string; text?: string; href?: string; buttonText?: string }) {
  return <div className="empty-state"><div className="empty-icon"><FilePlus2 size={26}/></div><h3>{title}</h3><p>{text}</p><Link className="button button-primary" href={href}>{buttonText} <ArrowRight size={16}/></Link></div>;
}
export function PanelHeading({ title, subtitle, link, linkText = "View all" }: { title: string; subtitle?: string; link?: string; linkText?: string }) {
  return <div className="panel-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{link && <Link href={link} className="text-link">{linkText} <ArrowRight size={15}/></Link>}</div>;
}
