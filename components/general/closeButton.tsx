export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-4 text-gray-500 hover:text-white"
    >
      ✕
    </button>
  );
}