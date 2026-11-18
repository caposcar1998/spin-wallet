"use client";

import { CustomButton } from "../general/button";
import { CloseButton } from "../general/closeButton";

export function ModalConfirmTransaction({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  quantity,
  reason,
  contact,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  quantity: number;
  reason: string;
  contact: string;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-xl p-6 bg-white">
        <CloseButton onClick={onClose} />
        <p>Cantidad: {quantity}</p>
        <p>Razón: {reason}</p>
        <p>Contacto: {contact}</p>
        <div className="mt-4">
          <CustomButton
            type="button"
            disabled={isPending}
            className="w-full"
            message={isPending ? "Enviando…" : "Confirmar"}
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
}
