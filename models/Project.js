import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
    status: { type: String, enum: ["active", "archived"], default: "active" },
  },
  { timestamps: true }
);

projectSchema.index({ ownerId: 1, createdAt: -1 });

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
