export default function Loading() {
  return (
    <div data-testid="loading-spinner" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-primary-light" />
    </div>
  );
}
