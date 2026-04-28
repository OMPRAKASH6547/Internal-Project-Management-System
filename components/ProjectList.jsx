"use client";

import { useState } from "react";

export default function ProjectList({
  projects,
  selectedProjectId,
  onSelectProject,
  onCreateProject,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <aside className="w-full rounded-2xl border border-zinc-200/80 bg-white/95 p-4 shadow-sm backdrop-blur lg:w-80">
      <h2 className="mb-3 text-lg font-semibold text-zinc-900">Projects</h2>
      <div className="mb-4 space-y-2">
        {projects.map((project) => (
          <button
            key={project.id}
            className={`w-full rounded-md border px-3 py-2 text-left ${
              selectedProjectId === project.id
                ? "border-[#ed1c24] bg-[#ed1c24] text-white shadow-sm"
                : "border-zinc-200 bg-zinc-50 text-zinc-900 hover:bg-zinc-100"
            }`}
            onClick={() => onSelectProject(project.id)}
          >
            <div className="font-semibold">{project.name}</div>
            <div className="text-xs opacity-80">{project.description || "No description"}</div>
          </button>
        ))}
      </div>

      <form
        className="space-y-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim()) return;
          onCreateProject({ name, description });
          setName("");
          setDescription("");
        }}
      >
        <input
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
          placeholder="Project name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <textarea
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
        />
        <button className="w-full rounded-lg bg-[#ed1c24] py-2 text-sm font-semibold text-white transition hover:bg-[#c9151d]">
          Create Project
        </button>
      </form>
    </aside>
  );
}
