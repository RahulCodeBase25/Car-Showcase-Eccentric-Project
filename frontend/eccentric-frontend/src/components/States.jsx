export function Loading({ label = "Loading" }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-ink" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <p className="max-w-md text-muted">{message}</p>
      {onRetry && (
        <button className="btn btn-dark" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
