"use client";

import { Title } from "@/components/general/title";
import { Alert } from "@/components/alert";
import { useActionState, useEffect, useState, startTransition } from "react";
import { CustomButton } from "@/components/general/button";
import { CustomInput } from "@/components/general/input";
import { sendTransaction, getSavedContacts, type SavedContact } from "./actions";
import { ModalContact } from "@/components/contacts/modalContact";
import { ModalConfirmTransaction } from "@/components/transactions/modalConfirmTransaction";

export default function Transactions() {
  const [state, formAction, isPending] = useActionState(
    sendTransaction,
    undefined,
  );
  const [closeAlert, setCloseAlert] = useState(false);
  const [contacts, setContacts] = useState<SavedContact[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");
  const [contact, setContact] = useState("");

  useEffect(() => {
    getSavedContacts()
      .then(setContacts)
      .catch(() => setContacts([]));
  }, []);

  useEffect(() => {
    setCloseAlert(false);
  }, [state]);

  const confirmTransaction = () => {
    const formData = new FormData();
    formData.set("Cantidad", String(quantity));
    formData.set("Motivo", reason);
    formData.set("Contacto", contact);
    formData.set("Fecha", new Date().toISOString());
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Title size="lg">Enviar Transacción</Title>
      <form
        className="w-full max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          setShowConfirmModal(true);
        }}
      >
        <CustomInput type="number" name="Cantidad" required onChange={(e) => setQuantity(Number(e.target.value))} />
        <div className="h-2" />
        <CustomInput type="text" name="Motivo" required onChange={(e) => setReason(e.target.value)} />
        <div className="h-2" />
        <select
        required
          name="Contacto"
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary focus:outline-none block w-full px-3 py-2.5 shadow-xs"
          onChange={(e) => {
            if (e.target.value === "new") {
              e.target.value = "";
              setShowModal(true);
              return;
            }
            setContact(
              contacts.find((c) => String(c.id) === e.target.value)?.name ?? "",
            );
          }}
        >
          <option value="">Selecciona un contacto</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name}
            </option>
          ))}
          <option value="new">Nuevo contacto</option>
        </select>
        <CustomButton
          type="submit"
          disabled={isPending}
          className="w-full"
          message={isPending ? "Cargando…" : "Enviar"}
        />
        {state?.error && !closeAlert && (
          <Alert type="error" isOpen={true} onClose={() => setCloseAlert(true)}>
            <p>{state.error}</p>
          </Alert>
        )}
      </form>
      <ModalContact isOpen={showModal} onClose={() => setShowModal(false)} />
      <ModalConfirmTransaction
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmTransaction}
        isPending={isPending}
        quantity={quantity}
        reason={reason}
        contact={contact}
      />
    </div>
  );
}
