"use client";

import { AlertProps } from "@/types/types";

export function Alert({ type, isOpen, onClose, children }: AlertProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`relative w-full max-w-md rounded-xl ${type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : type === "warning" ? "bg-yellow-500" : "bg-blue-500"} p-6 shadow-xl`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-white"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
