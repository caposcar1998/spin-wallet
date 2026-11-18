"use client";

import { AlertProps } from "@/types/types";
import { CloseButton } from "./general/closeButton";

const accents = {
  success: "border-green-500 text-green-700",
  error: "border-red-500 text-red-700",
  warning: "border-yellow-500 text-yellow-700",
} as const;

export function Alert({ type, isOpen, onClose, children }: AlertProps) {
  if (!isOpen) {
    return null;
  }

  const accent =
    type === "success" || type === "error" || type === "warning"
      ? accents[type]
      : "border-primary text-primary";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        data-testid={`${type}-alert`}
        className={`relative w-full max-w-md rounded-xl border-l-4 bg-white p-6 shadow-xl ${accent}`}
      >
        <CloseButton onClick={onClose || (() => {})} />

        {children}
      </div>
    </div>
  );
}
