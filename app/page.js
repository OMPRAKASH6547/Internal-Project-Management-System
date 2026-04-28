import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 md:py-14">
      <header className="mb-12 flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white/90 px-5 py-4 shadow-sm backdrop-blur">
        <div>
          <p className="text-sm font-semibold tracking-wide text-zinc-500">IPMS</p>
          <h1 className="text-xl font-bold text-zinc-900">Internal Project Management System</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Login
          </Link>
          <Link
            href="/login?mode=register"
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Register
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#ed1c24] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c9151d]"
          >
            Go to Dashboard
          </Link>
        </div>
      </header>

      <section className="mb-8 rounded-3xl border border-zinc-200/80 bg-white/90 p-7 shadow-sm backdrop-blur md:p-10">
        <p className="mb-3 inline-block rounded-full bg-[#ed1c24] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          Real-time Workspace
        </p>
        <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-zinc-900 md:text-5xl">
          Plan projects, manage tasks, and collaborate live with your team.
        </h2>
        <p className="mt-4 max-w-2xl text-base font-medium text-zinc-600 md:text-lg">
          IPMS gives your team one place for projects, Kanban workflow, role-based access, and live task updates.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#ed1c24] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c9151d]"
          >
            Start Managing Tasks
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
          >
            Sign In
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Project Control",
            text: "Create projects, manage members, and keep ownership and permissions structured.",
          },
          {
            title: "Kanban Workflow",
            text: "Track tasks in Todo, In Progress, and Done with fast updates and clear visibility.",
          },
          {
            title: "Live Collaboration",
            text: "Stay in sync instantly with real-time task and notification updates across your team.",
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-zinc-200/80 bg-white/90 p-5 shadow-sm backdrop-blur"
          >
            <h3 className="text-lg font-semibold text-zinc-900">{item.title}</h3>
            <p className="mt-2 text-sm font-medium leading-6 text-zinc-600">{item.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
