import { z } from "zod";
export const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(254).transform((v) => v.toLowerCase().trim()),
  password: z.string().min(8, "Use at least 8 characters").max(128),
});
export const loginSchema = z.object({
  email: z.email().transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1),
});
export const workspaceSchema = z.object({
  name: z.string().trim().min(2).max(80),
  industry: z.string().trim().min(2).max(100).default("General"),
  tone: z.enum(["Confident", "Playful", "Professional", "Friendly", "Bold"]).default("Confident"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#b79aff"),
});
export const postSchema = z.object({
  workspaceId: z.string().regex(/^[a-fA-F0-9]{24}$/),
  title: z.string().trim().min(2).max(140),
  caption: z.string().max(5000).default(""),
  hook: z.string().max(400).default(""),
  platform: z.enum(["Instagram", "LinkedIn", "X", "TikTok"]).default("Instagram"),
  type: z.enum(["post", "reel", "carousel", "story"]).default("post"),
  status: z.enum(["idea", "draft", "scheduled", "published"]).default("idea"),
  scheduledFor: z.iso.datetime({ offset: true }).nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
}).superRefine((data, ctx) => {
  if (data.status === "scheduled" && !data.scheduledFor) ctx.addIssue({ code: "custom", message: "Choose a date for a scheduled post", path: ["scheduledFor"] });
});
export const aiSchema = z.object({
  product: z.string().trim().min(2).max(180),
  audience: z.string().trim().min(2).max(160),
  goal: z.enum(["Awareness", "Engagement", "Sales", "Education"]),
  platform: z.enum(["Instagram", "LinkedIn", "X", "TikTok"]),
  tone: z.enum(["Confident", "Playful", "Professional", "Friendly", "Bold"]),
});
