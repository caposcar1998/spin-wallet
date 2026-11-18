"use client";

import { useActionState } from "react";
import { CustomButton } from "../general/button";
import { CustomInput } from "../general/input";
import { CloseButton } from "../general/closeButton";

export function ModalContact({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [_, formAction, isPending] = useActionState(
    () => {
      onClose();
    },
    undefined,
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-xl p-6 bg-white">
        <CloseButton onClick={onClose} />
        <form action={formAction}>
          <CustomInput type="text" name="Nombre contacto" required />
          <div className="h-2" />
          <CustomInput type="text" name="Cuenta" required />
          <div className="h-2" />
          <CustomButton
            type="submit"
            disabled={isPending}
            className="w-full"
            message={isPending ? "Guardando…" : "Guardar"}
          />
        </form>
      </div>
    </div>
  );
}
