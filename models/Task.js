import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["todo", "in_progress", "done"], default: "todo", index: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    assigneeId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

taskSchema.index({ projectId: 1, status: 1, updatedAt: -1 });

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
