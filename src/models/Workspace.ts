import mongoose, { Schema } from "mongoose";
export interface IWorkspace {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  name: string;
  industry: string;
  tone: string;
  color: string;
  createdAt: Date;
}
const WorkspaceSchema = new Schema<IWorkspace>({
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  industry: { type: String, default: "General", maxlength: 100 },
  tone: { type: String, default: "Confident", maxlength: 40 },
  color: { type: String, default: "#b79aff", match: /^#[0-9a-fA-F]{6}$/ },
}, { timestamps: true });
WorkspaceSchema.index({ ownerId: 1, name: 1 });
export const Workspace = (mongoose.models.Workspace as mongoose.Model<IWorkspace>) || mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);
