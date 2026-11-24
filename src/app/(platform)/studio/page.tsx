"use client";
import { useState } from "react";
import { ArrowRight, Copy, Save, Sparkles, WandSparkles, PenLine, ShieldCheck, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { api } from "@/lib/api";
import { PageHeading } from "@/components/UI";
import type { Platform, Tone } from "@/lib/types";
import { platforms, tones } from "@/lib/types";
type Result = { title: string; hook: string; caption: string; tags: string[]; mode: "ai" | "template" };
export default function StudioPage() {
  const { workspace, selectedId, refreshPosts } = useApp();
  const [product,setProduct] = useState("");
  const [audience,setAudience] = useState("");
  const [platform,setPlatform] = useState<Platform>("Instagram");
  const [tone,setTone] = useState<Tone>("Confident");
  const [goal,setGoal] = useState<"Awareness"|"Engagement"|"Sales"|"Education">("Awareness");
  const [result,setResult] = useState<Result|null>(null);
  const [busy,setBusy] = useState(false);
  const [saving,setSaving] = useState(false);
  const router = useRouter();
  async function generate(e: React.FormEvent) {
    e.preventDefault();setBusy(true);
    try { const res = await api<Result>("/api/ai/generate",{method:"POST",body:JSON.stringify({product,audience,goal,platform,tone})});setResult(res);toast.success(res.mode === "ai" ? "AI draft generated" : "Starter template generated"); }
    catch(err){toast.error(err instanceof Error ? err.message : "Generation failed");}
    finally{setBusy(false);}
  }
  async function save() {
    if(!result || !selectedId) return toast.error("Create a brand first");
    setSaving(true);
    try { await api("/api/posts",{method:"POST",body:JSON.stringify({workspaceId:selectedId,title:result.title,hook:result.hook,caption:result.caption,platform,type:"post",status:"draft",scheduledFor:null,tags:result.tags})});await refreshPosts();toast.success("Saved to content library");router.push("/content"); }
    catch(err){toast.error(err instanceof Error ? err.message : "Could not save");}
    finally{setSaving(false);}
  }
  return <><PageHeading eyebrow="THE IDEA LAB" title={<>Welcome to AI Studio <span className="heading-spark">✳</span></>} description="Turn a rough thought into a polished first draft. Then make it yours."/><div className="studio-layout"><section className="panel studio-input-panel"><div className="studio-card-heading"><span className="studio-number">01</span><div><h2>Tell us what you're making</h2><p>A few details help create a better starting point.</p></div></div><form onSubmit={generate} className="studio-form"><div className="field"><label htmlFor="product">What are you promoting?</label><textarea id="product" rows={3} value={product} minLength={2} maxLength={180} required onChange={(e)=>setProduct(e.target.value)} placeholder="E.g. A sustainable skincare brand's new hydrating serum"/></div><div className="field"><label htmlFor="audience">Who is it for?</label><input id="audience" required minLength={2} maxLength={160} value={audience} onChange={(e)=>setAudience(e.target.value)} placeholder="E.g. Young professionals interested in skincare"/></div><div className="form-grid"><div className="field"><label>Platform</label><select value={platform} onChange={(e)=>setPlatform(e.target.value as Platform)}>{platforms.map((p)=><option key={p}>{p}</option>)}</select></div><div className="field"><label>Goal</label><select value={goal} onChange={(e)=>setGoal(e.target.value as typeof goal)}>{["Awareness","Engagement","Sales","Education"].map((g)=><option key={g}>{g}</option>)}</select></div></div><div className="field"><label>Brand voice</label><div className="tone-chips">{tones.map((t)=><button type="button" key={t} onClick={()=>setTone(t)} className={tone === t ? "active" : ""}>{t}</button>)}</div></div><div className="studio-context"><span className="studio-context-dot" style={{ background: workspace?.color || "#b79aff" }}/><span>Creating for <strong>{workspace?.name || "your brand"}</strong></span><ShieldCheck size={17}/></div><button className="button button-primary studio-generate" type="submit" disabled={busy}><WandSparkles size={18}/>{busy ? "Creating your draft..." : result ? "Regenerate content" : "Generate content"}<ArrowRight size={17}/></button></form></section><section className="panel studio-output-panel"><div className="studio-card-heading"><span className="studio-number">02</span><div><h2>Your creative draft</h2><p>A strong starting point, ready for your finishing touch.</p></div></div>{result ? <div className="studio-result"><div className="result-mode"><span><Sparkles size={14}/>{result.mode === "ai" ? "AI-generated draft" : "Template mode · no AI key"}</span><span>{platform}</span></div><div className="result-inner"><div className="eyebrow">CONTENT TITLE</div><h3>{result.title}</h3><div className="eyebrow">THE HOOK</div><blockquote>{result.hook}</blockquote><div className="eyebrow">THE CAPTION</div><p className="result-caption">{result.caption}</p><div className="result-tags">{result.tags.map((t)=><span key={t}>#{t}</span>)}</div></div><div className="result-actions"><button className="button button-ghost" onClick={()=>{navigator.clipboard.writeText(`${result.hook}\n\n${result.caption}`);toast.success("Copied to clipboard");}}><Copy size={16}/> Copy text</button><button className="button button-primary" onClick={save} disabled={saving}><Save size={16}/>{saving ? "Saving..." : "Save as draft"}</button></div></div> : <div className="studio-placeholder"><div className="studio-placeholder-graphic"><div className="placeholder-orbit orbit-one"/><div className="placeholder-orbit orbit-two"/><Sparkles size={42}/></div><h3>Something good is brewing.</h3><p>Fill in the details and hit generate. Your new content idea will appear right here.</p><div><PenLine size={16}/> YOUR NEXT BIG IDEA STARTS HERE</div></div>}<div className="studio-tip"><RefreshCw size={16}/><span>Always review, fact-check and personalize generated text before publishing.</span></div></section></div></>;
}
