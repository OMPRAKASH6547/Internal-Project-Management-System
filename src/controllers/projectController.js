import {
  createProjectForUser,
  deleteProject,
  getProjectForUser,
  listProjectsForUser,
  removeProjectMember,
  updateProject,
  upsertProjectMember,
} from "../services/projectService.js";

function serializeProject(project) {
  return {
    id: String(project._id),
    name: project.name,
    description: project.description,
    status: project.status,
    ownerId: String(project.ownerId),
    memberIds: project.memberIds.map(String),
    members: (project.members || []).map((member) => ({
      userId: String(member.userId),
      role: member.role,
    })),
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export async function getProjects(req, res, next) {
  try {
    const projects = await listProjectsForUser(req.user.userId);
    res.json({ projects: projects.map(serializeProject) });
  } catch (error) {
    next(error);
  }
}

export async function postProject(req, res, next) {
  try {
    const project = await createProjectForUser(req.user.userId, req.validatedBody);
    res.status(201).json({ project: serializeProject(project) });
  } catch (error) {
    next(error);
  }
}

export async function getProject(req, res, next) {
  try {
    const { project } = await getProjectForUser(req.params.projectId, req.user.userId);
    res.json({ project: serializeProject(project) });
  } catch (error) {
    next(error);
  }
}

export async function patchProject(req, res, next) {
  try {
    const project = await updateProject(req.params.projectId, req.user.userId, req.validatedBody);
    res.json({ project: serializeProject(project) });
  } catch (error) {
    next(error);
  }
}

export async function deleteProjectById(req, res, next) {
  try {
    await deleteProject(req.params.projectId, req.user.userId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function putProjectMember(req, res, next) {
  try {
    const project = await upsertProjectMember(
      req.params.projectId,
      req.user.userId,
      req.params.userId,
      req.validatedBody.role
    );
    res.json({ project: serializeProject(project) });
  } catch (error) {
    next(error);
  }
}

export async function deleteProjectMemberByUser(req, res, next) {
  try {
    const project = await removeProjectMember(req.params.projectId, req.user.userId, req.params.userId);
    res.json({ project: serializeProject(project) });
  } catch (error) {
    next(error);
  }
}
