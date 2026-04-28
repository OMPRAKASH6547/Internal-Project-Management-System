export default function ErrorState({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="mb-4 flex items-center justify-between rounded-lg border border-[#ed1c24]/25 bg-[#ed1c24]/10 px-4 py-3 text-sm text-[#a21319]">
      <span>{message}</span>
      {onRetry ? (
        <button className="rounded bg-[#ed1c24] px-3 py-1 text-white hover:bg-[#c9151d]" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
