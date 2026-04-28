export default function GlobalLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl p-4">
      <div className="mb-4 h-20 animate-pulse rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm" />
      <div className="flex flex-col gap-4 lg:flex-row">
        <aside className="w-full rounded-2xl border border-zinc-200/80 bg-white/95 p-4 shadow-sm lg:w-80">
          <div className="mb-3 h-6 w-28 animate-pulse rounded bg-zinc-200" />
          <div className="space-y-2">
            <div className="h-14 animate-pulse rounded-lg bg-zinc-100" />
            <div className="h-14 animate-pulse rounded-lg bg-zinc-100" />
            <div className="h-14 animate-pulse rounded-lg bg-zinc-100" />
          </div>
        </aside>
        <section className="w-full rounded-2xl border border-zinc-200/80 bg-white/95 p-5 shadow-sm">
          <div className="mb-4 h-6 w-40 animate-pulse rounded bg-zinc-200" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="h-48 animate-pulse rounded-xl bg-zinc-100" />
            <div className="h-48 animate-pulse rounded-xl bg-zinc-100" />
            <div className="h-48 animate-pulse rounded-xl bg-zinc-100" />
          </div>
        </section>
      </div>
    </main>
  );
}
