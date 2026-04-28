import Project from "@/models/Project";

export async function assertProjectAccess(projectId, userId) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("NotFound");
  }

  const id = String(userId);
  const canAccess =
    String(project.ownerId) === id || project.memberIds.some((memberId) => String(memberId) === id);

  if (!canAccess) {
    throw new Error("Forbidden");
  }

  return project;
}
