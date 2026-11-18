"use client";

import { AlertProps } from "@/types/types";
import { CloseButton } from "./general/closeButton";

export function Alert({ type, isOpen, onClose, children }: AlertProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        data-testid={`${type}-alert`}
        className={`relative w-full max-w-md rounded-xl ${type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : type === "warning" ? "bg-yellow-500" : "bg-secondary"} p-6 shadow-xl`}
      >
        <CloseButton onClick={onClose || (() => {})} />

        {children}
      </div>
    </div>
  );
}
