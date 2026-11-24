"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Sparkles, ShieldCheck } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { api } from "@/lib/api";
export default function AuthForm({ mode }: { mode: "signup" | "login" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const signup = mode === "signup";
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      await api(`/api/auth/${mode}`, { method: "POST", body: JSON.stringify(signup ? { name, email, password } : { email, password }) });
      router.replace("/dashboard"); router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong"); }
    finally { setBusy(false); }
  }
  return <div className="auth-page"><div className="auth-left"><Link href="/"><BrandMark/></Link><div className="auth-art"><div className="auth-art-glow"/><div className="auth-float auth-float-a"><Sparkles size={18}/> Your creative process, upgraded.</div><div className="auth-art-card"><div className="auth-art-tag">VIRALFORGE / STUDIO</div><div className="auth-art-hero">Big ideas.<br/><span>Beautifully organized.</span></div><div className="auth-art-bar"><div style={{width:"78%"}}/><div style={{width:"49%"}}/><div style={{width:"65%"}}/></div><div className="auth-art-insight"><span>↗</span><div><strong>From concept to campaign</strong><small>One workspace for every possibility.</small></div></div></div><div className="auth-float auth-float-b"><ShieldCheck size={18}/> Built for your workflow</div></div><p>Made for makers, marketers & momentum.</p></div>
    <div className="auth-right"><div className="auth-card"><div className="auth-mobile-logo"><BrandMark/></div><div className="auth-kicker"><LockKeyhole size={15}/> SECURE ACCOUNT ACCESS</div><h1>{signup ? "Start making waves." : "Welcome back."}</h1><p className="auth-intro">{signup ? "Create your workspace and turn better ideas into even better content." : "Your next big idea is right where you left it."}</p>
      <form onSubmit={submit} className="auth-form">{signup && <div className="field"><label htmlFor="name">Full name</label><input id="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}/></div>}
      <div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/></div>
      <div className="field"><label htmlFor="password">Password</label><div className="password-wrap"><input id="password" type={show ? "text" : "password"} minLength={signup ? 8 : 1} maxLength={128} autoComplete={signup ? "new-password" : "current-password"} required placeholder={signup ? "At least 8 characters" : "Enter your password"} value={password} onChange={(e) => setPassword(e.target.value)}/><button type="button" className="password-toggle" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)}>{show ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></div>
      {error && <div role="alert" className="auth-error">{error}</div>}
      <button type="submit" className="button button-primary auth-submit" disabled={busy}>{busy ? "One moment..." : signup ? "Create free account" : "Sign in to workspace"}<ArrowRight size={18}/></button></form>
      <p className="auth-switch">{signup ? "Already have an account?" : "New to ViralForge?"} <Link href={signup ? "/login" : "/signup"}>{signup ? "Log in" : "Create an account"}</Link></p>
      <div className="auth-footnote">Your data stays inside your account. No credit card required.</div></div></div></div>;
}
