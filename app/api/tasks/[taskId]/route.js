import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { handleApiError, ok } from "@/lib/api-response";
import { assertProjectAccess } from "@/lib/project-access";
import { emitProjectEvent } from "@/lib/socket";
import { taskUpdateSchema } from "@/lib/validators";
import Task from "@/models/Task";

export async function PATCH(request, { params }) {
  try {
    const auth = requireAuth(request);
    const body = taskUpdateSchema.parse(await request.json());
    await connectDB();
    const { taskId } = await params;

    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error("NotFound");
    }

    await assertProjectAccess(task.projectId, auth.userId);

    if (body.assigneeId !== undefined) {
      body.assigneeId = body.assigneeId ? new mongoose.Types.ObjectId(body.assigneeId) : null;
    }
    if (body.dueDate !== undefined) {
      body.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }

    Object.assign(task, body);
    await task.save();

    const payload = {
      id: String(task._id),
      projectId: String(task.projectId),
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId ? String(task.assigneeId) : null,
      dueDate: task.dueDate,
      createdBy: String(task.createdBy),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };

    emitProjectEvent(task.projectId, "task:update", payload);
    return ok({ task: payload });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = requireAuth(request);
    await connectDB();
    const { taskId } = await params;

    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error("NotFound");
    }

    await assertProjectAccess(task.projectId, auth.userId);
    await Task.findByIdAndDelete(task._id);
    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
