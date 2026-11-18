"use client";

import { FormEvent } from "react";
import { CustomButton } from "../general/button";
import { CustomInput } from "../general/input";
import { CloseButton } from "../general/closeButton";
import { Title } from "../general/title";

export function ModalContact({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, cuenta: string) => void;
}) {
  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSave(
      String(formData.get("Nombre contacto") ?? ""),
      String(formData.get("Cuenta") ?? ""),
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div data-testid="contact-modal" className="relative w-full max-w-md rounded-xl p-6 bg-white">
        <CloseButton onClick={onClose} />
        <Title size="lg" className="text-primary pb-4">Agregar contacto</Title>
        <form onSubmit={handleSubmit}>
          <CustomInput type="text" name="Nombre contacto" required testId="contact-name-input" />
          <div className="h-2" />
          <CustomInput type="text" name="Cuenta" required testId="contact-account-input" />
          <div className="h-2" />
          <CustomButton
            type="submit"
            className="w-full"
            testId="contact-save-button"
            message="Guardar"
          />
        </form>
      </div>
    </div>
  );
}
