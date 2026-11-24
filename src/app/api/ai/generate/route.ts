import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { aiSchema } from "@/lib/validation";
import { handleApiError, jsonError } from "@/lib/http";
function fallback(data: { product: string; audience: string; platform: string; goal: string; tone: string }) {
  const hook = `What if ${data.product} could be simpler than you think?`;
  const caption = `${hook}\n\nFor ${data.audience}, the best results start with informed choices and a consistent approach.\n\nHere's a quick look at ${data.product}: what it is, who it's designed for, and three things to consider before getting started.\n\nSave this for later and share your experience in the comments.\n\n#BrandStory #SmartChoices #${data.platform.replace(/\W/g, "")}`;
  return { title: `${data.product} — ${data.goal} campaign`, hook, caption, tags: ["BrandStory", "SmartChoices", data.platform] };
}
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return jsonError("Not authenticated", 401);
  try {
    const data = aiSchema.parse(await req.json());
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ ...fallback(data), mode: "template" });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 18000);
    let response: Response;
    try {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          temperature: 0.75,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "You are a skilled social media copywriter. Return a JSON object with: title (string), hook (string), caption (string), tags (array of strings). No unsupported medical, financial or guaranteed outcome claims. Never invent research, statistics or product benefits." },
            { role: "user", content: `Write an original ${data.platform} post about ${data.product} for ${data.audience}. Goal: ${data.goal}. Tone: ${data.tone}.` },
          ],
        }), signal: controller.signal,
      });
    } finally { clearTimeout(timer); }
    if (!response.ok) return jsonError("AI provider unavailable. Remove your API key to use template mode.", 502);
    const body = await response.json();
    const raw = JSON.parse(body.choices?.[0]?.message?.content || "{}");
    if (typeof raw.title !== "string" || typeof raw.hook !== "string" || typeof raw.caption !== "string" || !Array.isArray(raw.tags)) return jsonError("AI returned an unexpected format", 502);
    return NextResponse.json({ title: raw.title.slice(0, 140), hook: raw.hook.slice(0, 400), caption: raw.caption.slice(0, 5000), tags: raw.tags.filter((t: unknown) => typeof t === "string").slice(0, 12).map((t: string) => t.replace(/^#/, "").slice(0, 40)), mode: "ai" });
  } catch (error) { return handleApiError(error); }
}
