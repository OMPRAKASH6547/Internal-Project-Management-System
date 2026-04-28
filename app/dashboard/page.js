"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ErrorState from "@/components/ErrorState";
import KanbanBoard from "@/components/KanbanBoard";
import LoadingState from "@/components/LoadingState";
import ProjectList from "@/components/ProjectList";
import { getSocketClient } from "@/lib/socket-client";
import { useProjectStore } from "@/store/useProjectStore";

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    projects,
    selectedProjectId,
    tasks,
    loading,
    error,
    loadMe,
    loadProjects,
    loadTasks,
    setSelectedProjectId,
    createProject,
    createTask,
    moveTask,
    deleteTask,
    upsertTask,
    removeTaskLocal,
    notifications,
    pushNotification,
    logout,
  } = useProjectStore();

  const normalizedTasks = tasks.map((task) => {
    const rawStatus = String(task.status || "todo").toLowerCase();
    const status =
      rawStatus === "in progress" || rawStatus === "in-progress"
        ? "in_progress"
        : ["todo", "in_progress", "done"].includes(rawStatus)
          ? rawStatus
          : "todo";
    return { ...task, status };
  });

  const groupedTasks = {
    todo: normalizedTasks.filter((task) => task.status === "todo"),
    in_progress: normalizedTasks.filter((task) => task.status === "in_progress"),
    done: normalizedTasks.filter((task) => task.status === "done"),
  };

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  useEffect(() => {
    if (!user) return;
    loadProjects();
  }, [user, loadProjects]);

  useEffect(() => {
    loadTasks();
  }, [selectedProjectId, loadTasks]);

  useEffect(() => {
    if (!selectedProjectId) return;

    const socket = getSocketClient();
    if (!socket) return;

    socket.emit("project:join", { projectId: selectedProjectId });

    const onTaskCreate = (task) => upsertTask(task);
    const onTaskUpdate = (task) => upsertTask(task);
    const onTaskDelete = ({ id }) => removeTaskLocal(id);
    const onNotification = (notification) => pushNotification(notification);

    socket.on("task:create", onTaskCreate);
    socket.on("task:update", onTaskUpdate);
    socket.on("task:delete", onTaskDelete);
    socket.on("notification", onNotification);

    return () => {
      socket.emit("project:leave", { projectId: selectedProjectId });
      socket.off("task:create", onTaskCreate);
      socket.off("task:update", onTaskUpdate);
      socket.off("task:delete", onTaskDelete);
      socket.off("notification", onNotification);
    };
  }, [selectedProjectId, upsertTask, removeTaskLocal, pushNotification]);

  if (loading && !projects.length && !tasks.length) {
    return (
      <main className="mx-auto w-full max-w-6xl p-4">
        <LoadingState label="Loading dashboard..." />
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl p-4">
      <header className="mb-4 flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white/95 p-4 shadow-sm backdrop-blur">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Project Dashboard</h1>
          <p className="text-sm font-medium text-zinc-600">{user?.email}</p>
        </div>
        <button
          className="rounded-lg border border-[#ed1c24] bg-[#ed1c24] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#c9151d]"
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
        >
          Logout
        </button>
      </header>

      <ErrorState message={error} />
      {!!notifications.length && (
        <section className="mb-4 rounded-2xl border border-zinc-200/80 bg-white/95 p-3 shadow-sm backdrop-blur">
          <h2 className="mb-2 text-sm font-semibold text-zinc-800">Notifications</h2>
          <div className="space-y-1 text-xs text-zinc-600">
            {notifications.slice(0, 5).map((item, index) => (
              <p key={`${item.type}-${item.taskId || "na"}-${item.createdAt || index}`}>{item.message}</p>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col gap-4 lg:flex-row">
        <ProjectList
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
          onCreateProject={createProject}
        />
        <KanbanBoard
          projectId={selectedProjectId}
          groupedTasks={groupedTasks}
          onCreateTask={async (payload) => {
            await createTask(payload);
            await loadTasks();
          }}
          onMoveTask={moveTask}
          onDeleteTask={deleteTask}
        />
      </div>
    </main>
  );
}
