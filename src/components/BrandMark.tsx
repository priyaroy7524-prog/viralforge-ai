import { Zap } from "lucide-react";
export default function BrandMark({ small = false }: { small?: boolean }) {
  return <div className="brand"><span className="brand-icon"><Zap size={small ? 16 : 20} fill="currentColor" strokeWidth={2.5}/></span><span className={small ? "brand-word small" : "brand-word"}>viral<span>forge</span><span className="brand-ai">AI</span></span></div>;
}
