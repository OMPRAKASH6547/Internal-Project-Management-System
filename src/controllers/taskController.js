import { createTask, deleteTask, listTasksByProject, updateTask } from "../services/taskService.js";

function serializeTask(task) {
  return {
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
}

export async function getTasks(req, res, next) {
  try {
    const projectId = req.query.projectId;
    if (!projectId) return res.status(400).json({ error: "Missing projectId query parameter" });

    const tasks = await listTasksByProject(projectId, req.user.userId);
    res.json({ tasks: tasks.map(serializeTask) });
  } catch (error) {
    next(error);
  }
}

export async function postTask(req, res, next) {
  try {
    const task = await createTask(req.validatedBody, req.user.userId);
    const payload = serializeTask(task);
    req.app.locals.io.to(`project:${payload.projectId}`).emit("task:create", payload);
    if (payload.assigneeId && payload.assigneeId !== req.user.userId) {
      req.app.locals.io.to(`user:${payload.assigneeId}`).emit("notification", {
        type: "task:assigned",
        taskId: payload.id,
        projectId: payload.projectId,
        message: `You were assigned "${payload.title}"`,
        createdAt: new Date().toISOString(),
      });
    }
    res.status(201).json({ task: payload });
  } catch (error) {
    next(error);
  }
}

export async function patchTask(req, res, next) {
  try {
    const task = await updateTask(req.params.taskId, req.validatedBody, req.user.userId);
    const payload = serializeTask(task);
    req.app.locals.io.to(`project:${payload.projectId}`).emit("task:update", payload);
    req.app.locals.io.to(`project:${payload.projectId}`).emit("notification", {
      type: "task:updated",
      taskId: payload.id,
      projectId: payload.projectId,
      message: `Task updated: "${payload.title}"`,
      createdAt: new Date().toISOString(),
    });
    if (payload.assigneeId && payload.assigneeId !== req.user.userId) {
      req.app.locals.io.to(`user:${payload.assigneeId}`).emit("notification", {
        type: "task:assigned",
        taskId: payload.id,
        projectId: payload.projectId,
        message: `Task assignment updated: "${payload.title}"`,
        createdAt: new Date().toISOString(),
      });
    }
    res.json({ task: payload });
  } catch (error) {
    next(error);
  }
}

export async function removeTask(req, res, next) {
  try {
    const result = await deleteTask(req.params.taskId, req.user.userId);
    req.app.locals.io.to(`project:${result.projectId}`).emit("task:delete", { id: result.taskId });
    req.app.locals.io.to(`project:${result.projectId}`).emit("notification", {
      type: "task:deleted",
      taskId: result.taskId,
      projectId: result.projectId,
      message: "A task was deleted",
      createdAt: new Date().toISOString(),
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}
