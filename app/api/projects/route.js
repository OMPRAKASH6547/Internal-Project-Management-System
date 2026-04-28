import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { handleApiError, ok } from "@/lib/api-response";
import { projectCreateSchema } from "@/lib/validators";
import Project from "@/models/Project";

export async function GET(request) {
  try {
    const auth = requireAuth(request);
    await connectDB();

    const projects = await Project.find({
      $or: [{ ownerId: auth.userId }, { memberIds: auth.userId }],
    })
      .sort({ updatedAt: -1 })
      .lean();

    return ok({
      projects: projects.map((project) => ({
        id: String(project._id),
        name: project.name,
        description: project.description,
        status: project.status,
        ownerId: String(project.ownerId),
        memberIds: project.memberIds.map(String),
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request) {
  try {
    const auth = requireAuth(request);
    const body = projectCreateSchema.parse(await request.json());
    await connectDB();

    const project = await Project.create({
      name: body.name,
      description: body.description,
      ownerId: auth.userId,
      memberIds: [auth.userId],
    });

    return ok(
      {
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
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
