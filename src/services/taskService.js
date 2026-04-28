import mongoose from "mongoose";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

function toObjectIdString(value) {
  return String(value);
}

function getProjectRole(project, userId) {
  const uid = toObjectIdString(userId);
  if (toObjectIdString(project.ownerId) === uid) return "admin";
  const member = project.members?.find((entry) => toObjectIdString(entry.userId) === uid);
  if (member?.role) return member.role;
  if (project.memberIds.some((memberId) => toObjectIdString(memberId) === uid)) return "member";
  return null;
}

async function assertProjectMembership(projectId, userId) {
  const project = await Project.findById(projectId);
  if (!project) {
    const err = new Error("Project not found");
    err.statusCode = 404;
    throw err;
  }

  const role = getProjectRole(project, userId);
  if (!role) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }
  return { project, role };
}

export async function listTasksByProject(projectId, userId) {
  await assertProjectMembership(projectId, userId);
  return Task.find({ projectId }).sort({ updatedAt: -1 }).lean();
}

export async function createTask(payload, userId) {
  await assertProjectMembership(payload.projectId, userId);

  return Task.create({
    ...payload,
    assigneeId: payload.assigneeId ? new mongoose.Types.ObjectId(payload.assigneeId) : null,
    dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
    createdBy: userId,
  });
}

export async function updateTask(taskId, payload, userId) {
  const task = await Task.findById(taskId);
  if (!task) {
    const err = new Error("Task not found");
    err.statusCode = 404;
    throw err;
  }

  await assertProjectMembership(task.projectId, userId);
  if (payload.assigneeId !== undefined) {
    payload.assigneeId = payload.assigneeId ? new mongoose.Types.ObjectId(payload.assigneeId) : null;
  }
  if (payload.dueDate !== undefined) {
    payload.dueDate = payload.dueDate ? new Date(payload.dueDate) : null;
  }
  Object.assign(task, payload);
  await task.save();
  return task;
}

export async function deleteTask(taskId, userId) {
  const task = await Task.findById(taskId);
  if (!task) {
    const err = new Error("Task not found");
    err.statusCode = 404;
    throw err;
  }

  const { role } = await assertProjectMembership(task.projectId, userId);
  if (!["admin", "manager"].includes(role)) {
    const err = new Error("Only project admin/manager can delete tasks");
    err.statusCode = 403;
    throw err;
  }

  await Task.findByIdAndDelete(task._id);
  return { taskId: toObjectIdString(task._id), projectId: toObjectIdString(task.projectId) };
}
