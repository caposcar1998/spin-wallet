"use client";

import { Title } from "@/components/general/title";
import { Alert } from "@/components/alert";
import { useActionState, useState } from "react";
import { CustomButton } from "@/components/general/button";
import { CustomInput } from "@/components/general/input";
import { sendTransaction } from "./actions";
import { ModalContact } from "@/components/contacts/modalContact";
import { ModalConfirmTransaction } from "@/components/transactions/modalConfirmTransaction";
import { ContactSelect } from "@/components/transactions/contactSelect";
import { useContacts } from "@/components/transactions/useContacts";

export default function Transactions() {
  const [state, formAction, isPending] = useActionState(
    sendTransaction,
    undefined,
  );
  const [closeAlert, setCloseAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");
  const { contacts, contact, contactId, setContactId, addContact } = useContacts();

  const [prevActionState, setPrevActionState] = useState(state);
  if (state !== prevActionState) {
    setPrevActionState(state);
    setCloseAlert(false);
    if (state?.error) setShowConfirmModal(false);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <Title size="sm" className="mb-6 text-center text-primary">Enviar Transacción</Title>
      <form
        data-testid="transaction-form"
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          setShowConfirmModal(true);
        }}
      >
        <CustomInput type="number" name="Cantidad" required testId="transaction-amount-input" onChange={(e) => setQuantity(Number(e.target.value))} />
        <div className="h-3" />
        <CustomInput type="text" name="Motivo" required testId="transaction-reason-input" onChange={(e) => setReason(e.target.value)} />
        <div className="h-3" />
        <ContactSelect
          testId="contact-select"
          contacts={contacts}
          value={contactId}
          onChange={(id) =>
            id === "new" ? setShowModal(true) : setContactId(id)
          }
        />
        <CustomButton
          type="submit"
          disabled={isPending}
          className="w-full mt-5"
          testId="transaction-submit-button"
          message={isPending ? "Cargando…" : "Enviar"}
        />
        {state?.error && !closeAlert && (
          <Alert type="error" isOpen={true} onClose={() => setCloseAlert(true)}>
            <p>{state.error}</p>
          </Alert>
        )}
      </form>
      <ModalContact
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={addContact}
      />
      <ModalConfirmTransaction
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        formAction={formAction}
        isPending={isPending}
        quantity={quantity}
        reason={reason}
        contact={contact}
      />
      </div>
    </div>
  );
}
