import mongoose, { Schema } from "mongoose";
export type Platform = "Instagram" | "LinkedIn" | "X" | "TikTok";
export type PostStatus = "idea" | "draft" | "scheduled" | "published";
export type PostType = "post" | "reel" | "carousel" | "story";
export interface IPost {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  title: string;
  caption: string;
  hook: string;
  platform: Platform;
  type: PostType;
  status: PostStatus;
  scheduledFor?: Date | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
const PostSchema = new Schema<IPost>({
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
  title: { type: String, required: true, maxlength: 140 },
  caption: { type: String, default: "", maxlength: 5000 },
  hook: { type: String, default: "", maxlength: 400 },
  platform: { type: String, enum: ["Instagram", "LinkedIn", "X", "TikTok"], default: "Instagram" },
  type: { type: String, enum: ["post", "reel", "carousel", "story"], default: "post" },
  status: { type: String, enum: ["idea", "draft", "scheduled", "published"], default: "idea" },
  scheduledFor: { type: Date, default: null },
  tags: [{ type: String, maxlength: 40 }],
}, { timestamps: true });
PostSchema.index({ ownerId: 1, workspaceId: 1, scheduledFor: 1 });
export const Post = (mongoose.models.Post as mongoose.Model<IPost>) || mongoose.model<IPost>("Post", PostSchema);
