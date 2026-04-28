import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "ExpressProject", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["todo", "in_progress", "done"], default: "todo", index: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    assigneeId: { type: Schema.Types.ObjectId, ref: "ExpressUser", default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "ExpressUser", required: true },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const Task = mongoose.models.ExpressTask || mongoose.model("ExpressTask", schema);
export default Task;
