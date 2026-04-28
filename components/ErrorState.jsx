export default function ErrorState({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="mb-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span>{message}</span>
      {onRetry ? (
        <button className="rounded bg-red-700 px-3 py-1 text-white" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
