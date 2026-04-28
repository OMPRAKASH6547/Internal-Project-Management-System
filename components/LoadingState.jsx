export default function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-200/80 bg-white/95 px-4 py-3 text-sm text-zinc-700 shadow-sm">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-[#ed1c24]" />
      <span className="font-medium">{label}</span>
    </div>
  );
}
