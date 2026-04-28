import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(64),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(64),
});

export const projectCreateSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(1000).optional().default(""),
});

export const projectUpdateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(["active", "archived"]).optional(),
});

export const taskCreateSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional().default(""),
  status: z.enum(["todo", "in_progress", "done"]).optional().default("todo"),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.iso.datetime().nullable().optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.iso.datetime().nullable().optional(),
});
