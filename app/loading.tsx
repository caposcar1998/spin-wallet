export default function Loading() {
  return (
    <div data-testid="loading-spinner" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-xl bg-secondary p-6 shadow-xl">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-buttons" />
      </div>
    </div>
  );
}
