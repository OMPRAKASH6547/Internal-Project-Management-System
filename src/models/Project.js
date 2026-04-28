import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    ownerId: { type: Schema.Types.ObjectId, ref: "ExpressUser", required: true, index: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: "ExpressUser", index: true }],
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "ExpressUser", required: true },
        role: { type: String, enum: ["admin", "manager", "member"], default: "member" },
      },
    ],
    status: { type: String, enum: ["active", "archived"], default: "active" },
  },
  { timestamps: true }
);

schema.index({ "members.userId": 1 });

const Project = mongoose.models.ExpressProject || mongoose.model("ExpressProject", schema);
export default Project;
