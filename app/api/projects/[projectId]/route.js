import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { handleApiError, ok } from "@/lib/api-response";
import { assertProjectAccess } from "@/lib/project-access";
import { projectUpdateSchema } from "@/lib/validators";
import Project from "@/models/Project";

export async function GET(request, { params }) {
  try {
    const auth = requireAuth(request);
    await connectDB();
    const { projectId } = await params;

    const project = await assertProjectAccess(projectId, auth.userId);
    return ok({
      project: {
        id: String(project._id),
        name: project.name,
        description: project.description,
        status: project.status,
        ownerId: String(project.ownerId),
        memberIds: project.memberIds.map(String),
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request, { params }) {
  try {
    const auth = requireAuth(request);
    const body = projectUpdateSchema.parse(await request.json());
    await connectDB();
    const { projectId } = await params;

    const project = await assertProjectAccess(projectId, auth.userId);
    Object.assign(project, body);
    await project.save();

    return ok({
      project: {
        id: String(project._id),
        name: project.name,
        description: project.description,
        status: project.status,
        ownerId: String(project.ownerId),
        memberIds: project.memberIds.map(String),
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = requireAuth(request);
    await connectDB();
    const { projectId } = await params;

    const project = await assertProjectAccess(projectId, auth.userId);
    await Project.findByIdAndDelete(project._id);
    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
