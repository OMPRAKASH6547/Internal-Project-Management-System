"use client";

import { useState } from "react";

const STATUSES = [
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export default function KanbanBoard({ projectId, groupedTasks, onCreateTask, onMoveTask, onDeleteTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <section className="w-full rounded-2xl border border-zinc-200/80 bg-white/95 p-5 shadow-sm backdrop-blur">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900">Kanban Board</h2>
      <form
        className="mb-5 grid grid-cols-1 gap-2 md:grid-cols-[2fr_2fr_1fr]"
        onSubmit={(event) => {
          event.preventDefault();
          if (!projectId || !title.trim()) return;
          onCreateTask({ projectId, title, description });
          setTitle("");
          setDescription("");
        }}
      >
        <input
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
          placeholder="Task title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
          placeholder="Task description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button className="rounded-lg bg-[#ed1c24] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#c9151d]">
          Add Task
        </button>
      </form>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {STATUSES.map((status) => (
          <div key={status.key} className="rounded-xl border border-zinc-200 bg-zinc-50/90 p-3">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-700">
              {status.label}
            </h3>
            <div className="space-y-2">
              {groupedTasks[status.key]?.map((task) => (
                <div key={task.id} className="rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-sm">
                  <p className="text-sm font-semibold text-zinc-900">{task.title}</p>
                  <p className="mt-1 text-xs font-medium text-zinc-600">{task.description || "No description"}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {STATUSES.filter((item) => item.key !== task.status).map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        className="rounded-md border border-zinc-300 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
                        onClick={() => onMoveTask(task.id, option.key)}
                      >
                        Move to {option.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="rounded-md border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
