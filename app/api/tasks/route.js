import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { handleApiError, ok, fail } from "@/lib/api-response";
import { assertProjectAccess } from "@/lib/project-access";
import { emitProjectEvent } from "@/lib/socket";
import { taskCreateSchema } from "@/lib/validators";
import Task from "@/models/Task";

export async function GET(request) {
  try {
    const auth = requireAuth(request);
    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");

    if (!projectId) {
      return fail("Missing projectId query parameter", 400);
    }

    await connectDB();
    await assertProjectAccess(projectId, auth.userId);

    const tasks = await Task.find({ projectId }).sort({ updatedAt: -1 }).lean();

    return ok({
      tasks: tasks.map((task) => ({
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
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request) {
  try {
    const auth = requireAuth(request);
    const body = taskCreateSchema.parse(await request.json());
    await connectDB();

    await assertProjectAccess(body.projectId, auth.userId);

    const task = await Task.create({
      projectId: body.projectId,
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      assigneeId: body.assigneeId ? new mongoose.Types.ObjectId(body.assigneeId) : null,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      createdBy: auth.userId,
    });

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

    emitProjectEvent(task.projectId, "task:create", payload);
    return ok({ task: payload }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
