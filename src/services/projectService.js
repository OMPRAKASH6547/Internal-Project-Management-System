import Project from "../models/Project.js";
import User from "../models/User.js";

function toObjectIdString(value) {
  return String(value);
}

function getProjectRole(project, userId) {
  const uid = toObjectIdString(userId);
  if (toObjectIdString(project.ownerId) === uid) return "admin";

  const member = project.members?.find((entry) => toObjectIdString(entry.userId) === uid);
  if (member?.role) return member.role;

  if (project.memberIds?.some((memberId) => toObjectIdString(memberId) === uid)) return "member";
  return null;
}

function canManageProject(role) {
  return role === "admin" || role === "manager";
}

export async function listProjectsForUser(userId) {
  return Project.find({
    $or: [{ ownerId: userId }, { memberIds: userId }, { "members.userId": userId }],
  })
    .sort({ updatedAt: -1 })
    .lean();
}

export async function createProjectForUser(userId, payload) {
  return Project.create({
    name: payload.name,
    description: payload.description || "",
    ownerId: userId,
    memberIds: [userId],
    members: [{ userId, role: "admin" }],
  });
}

export async function getProjectForUser(projectId, userId) {
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

export async function updateProject(projectId, userId, payload) {
  const { project, role } = await getProjectForUser(projectId, userId);
  if (!canManageProject(role)) {
    const err = new Error("Only project admin/manager can update project details");
    err.statusCode = 403;
    throw err;
  }
  Object.assign(project, payload);
  await project.save();
  return project;
}

export async function deleteProject(projectId, userId) {
  const { project, role } = await getProjectForUser(projectId, userId);
  if (role !== "admin") {
    const err = new Error("Only project admin can delete project");
    err.statusCode = 403;
    throw err;
  }
  await Project.findByIdAndDelete(project._id);
}

export async function upsertProjectMember(projectId, actorUserId, targetUserId, role) {
  const { project, role: actorRole } = await getProjectForUser(projectId, actorUserId);
  if (!canManageProject(actorRole)) {
    const err = new Error("Only project admin/manager can manage members");
    err.statusCode = 403;
    throw err;
  }

  const user = await User.findById(targetUserId).select("_id");
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const existing = project.members.find((entry) => toObjectIdString(entry.userId) === toObjectIdString(targetUserId));
  if (existing) {
    existing.role = role;
  } else {
    project.members.push({ userId: targetUserId, role });
  }

  if (!project.memberIds.some((memberId) => toObjectIdString(memberId) === toObjectIdString(targetUserId))) {
    project.memberIds.push(targetUserId);
  }

  await project.save();
  return project;
}

export async function removeProjectMember(projectId, actorUserId, targetUserId) {
  const { project, role: actorRole } = await getProjectForUser(projectId, actorUserId);
  if (!canManageProject(actorRole)) {
    const err = new Error("Only project admin/manager can manage members");
    err.statusCode = 403;
    throw err;
  }

  if (toObjectIdString(project.ownerId) === toObjectIdString(targetUserId)) {
    const err = new Error("Project owner cannot be removed");
    err.statusCode = 400;
    throw err;
  }

  project.members = project.members.filter((entry) => toObjectIdString(entry.userId) !== toObjectIdString(targetUserId));
  project.memberIds = project.memberIds.filter((memberId) => toObjectIdString(memberId) !== toObjectIdString(targetUserId));
  await project.save();
  return project;
}
