"use client";

import { create } from "zustand";
import { authApi, projectsApi, tasksApi } from "@/lib/api-client";

const byStatus = (tasks, status) => tasks.filter((task) => task.status === status);
const dedupeTasksById = (tasks) => {
  const unique = new Map();
  tasks.forEach((task) => {
    if (!task?.id) return;
    unique.set(task.id, task);
  });
  return [...unique.values()];
};

export const useProjectStore = create((set, get) => ({
  user: null,
  projects: [],
  selectedProjectId: null,
  tasks: [],
  loading: false,
  error: null,
  notifications: [],

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setSelectedProjectId: (selectedProjectId) => set({ selectedProjectId }),
  upsertTask: (incomingTask) =>
    set((state) => ({
      tasks: dedupeTasksById([incomingTask, ...state.tasks]),
    })),
  removeTaskLocal: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
  pushNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 30),
    })),

  loadMe: async () => {
    set({ loading: true, error: null });
    try {
      const { user } = await authApi.me();
      set({ user, loading: false });
    } catch (error) {
      set({ user: null, loading: false, error: error.message });
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { user } = await authApi.login(credentials);
      set({ user, loading: false });
      return true;
    } catch (error) {
      set({ loading: false, error: error.message });
      return false;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { user } = await authApi.register(payload);
      set({ user, loading: false });
      return true;
    } catch (error) {
      set({ loading: false, error: error.message });
      return false;
    }
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, projects: [], selectedProjectId: null, tasks: [], notifications: [] });
  },

  loadProjects: async () => {
    set({ loading: true, error: null });
    try {
      const { projects } = await projectsApi.list();
      const currentSelected = get().selectedProjectId;
      set({
        projects,
        selectedProjectId: currentSelected || projects[0]?.id || null,
        loading: false,
      });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },

  createProject: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { project } = await projectsApi.create(payload);
      set((state) => ({
        projects: [project, ...state.projects],
        selectedProjectId: project.id,
        loading: false,
      }));
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },

  loadTasks: async () => {
    const selectedProjectId = get().selectedProjectId;
    if (!selectedProjectId) {
      set({ tasks: [] });
      return;
    }

    set({ loading: true, error: null });
    try {
      const { tasks } = await tasksApi.list(selectedProjectId);
      set({ tasks: dedupeTasksById(tasks), loading: false });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },

  createTask: async (payload) => {
    try {
      const { task } = await tasksApi.create(payload);
      set((state) => ({ tasks: dedupeTasksById([task, ...state.tasks]) }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  moveTask: async (taskId, status) => {
    try {
      const { task } = await tasksApi.update(taskId, { status });
      set((state) => ({
        tasks: [task, ...state.tasks.filter((item) => item.id !== task.id)],
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },
  deleteTask: async (taskId) => {
    try {
      await tasksApi.remove(taskId);
      set((state) => ({
        tasks: state.tasks.filter((item) => item.id !== taskId),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  groupedTasks: () => {
    const tasks = get().tasks;
    return {
      todo: byStatus(tasks, "todo"),
      in_progress: byStatus(tasks, "in_progress"),
      done: byStatus(tasks, "done"),
    };
  },
}));
