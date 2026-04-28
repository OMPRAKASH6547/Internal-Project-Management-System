import { Router } from "express";
import {
  deleteProjectById,
  deleteProjectMemberByUser,
  getProject,
  getProjects,
  patchProject,
  postProject,
  putProjectMember,
} from "../controllers/projectController.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createProjectSchema, projectMemberRoleSchema, updateProjectSchema } from "../validation/schemas.js";

const router = Router();

router.get("/", authMiddleware, getProjects);
router.post("/", authMiddleware, validate(createProjectSchema), postProject);
router.get("/:projectId", authMiddleware, getProject);
router.patch("/:projectId", authMiddleware, validate(updateProjectSchema), patchProject);
router.delete("/:projectId", authMiddleware, deleteProjectById);
router.put("/:projectId/members/:userId", authMiddleware, validate(projectMemberRoleSchema), putProjectMember);
router.delete("/:projectId/members/:userId", authMiddleware, deleteProjectMemberByUser);

export default router;
