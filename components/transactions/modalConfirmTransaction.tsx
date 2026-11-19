"use client";

import { CustomButton } from "../general/button";
import { CloseButton } from "../general/closeButton";
import { formatCurrency } from "@/lib/format";

export function ModalConfirmTransaction({
  isOpen,
  onClose,
  formAction,
  isPending,
  quantity,
  reason,
  contact,
}: {
  isOpen: boolean;
  onClose: () => void;
  formAction: (formData: FormData) => void;
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
      <div data-testid="confirm-transaction-modal" className="relative w-full max-w-md rounded-xl p-6 bg-white">
        <CloseButton onClick={onClose} />
        <p className="mb-4 text-lg font-semibold text-gray-900">Confirmar transacción</p>
        <dl className="flex flex-col gap-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <dt className="font-medium text-gray-500">Cantidad</dt>
            <dd className="font-semibold text-gray-900">{formatCurrency(quantity)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-gray-500">Razón</dt>
            <dd className="font-semibold text-gray-900">{reason}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-gray-500">Contacto</dt>
            <dd className="font-semibold text-gray-900">{contact}</dd>
          </div>
        </dl>
        <form action={formAction} className="mt-4">
          <input type="hidden" name="Cantidad" value={quantity} />
          <input type="hidden" name="Motivo" value={reason} />
          <input type="hidden" name="Contacto" value={contact} />
          <input type="hidden" name="Fecha" value={new Date().toISOString()} />
          <CustomButton
            type="submit"
            disabled={isPending}
            className="w-full"
            testId="confirm-transaction-button"
            message={isPending ? "Enviando…" : "Confirmar"}
          />
        </form>
      </div>
    </div>
  );
}
