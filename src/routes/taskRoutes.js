import { Router } from "express";
import { getTasks, patchTask, postTask, removeTask } from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createTaskSchema, updateTaskSchema } from "../validation/schemas.js";

const router = Router();

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, validate(createTaskSchema), postTask);
router.patch("/:taskId", authMiddleware, validate(updateTaskSchema), patchTask);
router.delete("/:taskId", authMiddleware, removeTask);

export default router;
