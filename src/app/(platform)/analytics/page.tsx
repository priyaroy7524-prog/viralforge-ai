"use client";
import { useMemo } from "react";
import { format, subDays, isAfter, parseISO } from "date-fns";
import { ArrowUpRight, BarChart3, ChartNoAxesCombined, CircleAlert, Layers3, Sparkles, Target } from "lucide-react";
import { PageHeading, PanelHeading } from "@/components/UI";
import { useApp } from "@/components/AppProvider";
import type { Platform } from "@/lib/types";
const categories: Platform[] = ["Instagram", "LinkedIn", "X", "TikTok"];
export default function AnalyticsPage() {
  const { posts, workspace } = useApp();
  const latest = useMemo(() => posts.filter(p => isAfter(parseISO(p.createdAt), subDays(new Date(),30))), [posts]);
  const published = posts.filter(p => p.status === "published").length;
  const scheduled = posts.filter(p => p.status === "scheduled").length;
  const max = Math.max(1, ...categories.map(c => posts.filter(p => p.platform === c).length));
  const weeks = Array.from({length: 7}, (_,i) => ({label:format(subDays(new Date(),6-i), "EEE"), count: posts.filter(p => format(parseISO(p.createdAt),"yyyy-MM-dd") === format(subDays(new Date(),6-i),"yyyy-MM-dd")).length }));
  return <>
    <PageHeading eyebrow="INSIGHTS WITHOUT THE NOISE" title={<>Content analytics <span className="heading-spark">✳</span></>} description={`Understand what you're making${workspace ? ` for ${workspace.name}` : ""} and where your workflow is heading.`}/>
    <div className="insight-banner"><CircleAlert size={23}/><div><h3>Transparent, first-party insights</h3><p>These charts report content stored in ViralForge only—not Instagram, TikTok or LinkedIn reach, followers or engagement. Social account integrations are not included.</p></div></div>
    <div className="analytics-stat-grid">
      {[["All content",posts.length,"Total posts and ideas saved",Layers3],["Added in 30 days",latest.length,"New items in your library",Sparkles],["Marked published",published,"Manually updated status",Target]].map(([label,value,description,Icon]) => { const I = Icon as typeof Layers3; return <div className="analytic-stat" key={String(label)}><div style={{display:"flex",justifyContent:"space-between",color:"#bda8e7"}}><small>{String(label)}</small><I size={19}/></div><strong>{String(value).padStart(2,"0")}</strong><span>{String(description)}</span></div>; })}
    </div>
    <div className="analytics-detail">
      <section className="panel"><PanelHeading title="Where your content lives" subtitle="Distribution by chosen social platform"/><div className="analytics-bars">{categories.map(c => { const v = posts.filter(p=>p.platform===c).length; return <div className="analytics-bar" key={c}><strong style={{fontSize:13}}>{v}</strong><div className="bar" style={{height:`${Math.max(3,(v/max)*170)}px`}}/><small>{c}</small></div>; })}</div><p className="analytics-legend">Platform counts reflect manually saved content in this workspace.</p></section>
      <section className="panel"><PanelHeading title="Your publishing pipeline" subtitle="Content planning at a glance"/><div className="pipeline-list">{[["Idea",posts.filter(p=>p.status==="idea").length,"#bca2ff"],["Draft",posts.filter(p=>p.status==="draft").length,"#f6ce8a"],["Scheduled",scheduled,"#84dce9"],["Published",published,"#91dbba"]].map(([n,value,color])=><div key={String(n)} className="pipeline-row"><div className="pipeline-label"><span className="pipeline-dot" style={{background:String(color)}}/>{n}<b>{value}</b></div><div className="pipeline-track"><div style={{width:`${posts.length ? Number(value)/posts.length*100:0}%`,background:String(color)}}/></div></div>)}</div><div className="pipeline-total"><ChartNoAxesCombined size={17}/> {posts.length ? Math.round(published/posts.length*100) : 0}% manually marked as published</div></section>
    </div>
    <div className="panel" style={{marginTop:18}}><PanelHeading title="Last 7 days" subtitle="Your daily content creation activity"/><div className="analytics-bars" style={{height:170}}>{weeks.map(d=><div className="analytics-bar" key={d.label}><strong style={{fontSize:12}}>{d.count}</strong><div className="bar" style={{height:`${Math.max(3,d.count/Math.max(1,...weeks.map(w=>w.count))*110)}px`}}/><small>{d.label}</small></div>)}</div><p className="analytics-legend">Tip: Write a case study about how you designed this analytics system from actual database records.</p></div>
  </>;
}
