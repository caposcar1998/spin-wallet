"use server";

import { apiGet, apiPost } from "@/lib/api";
import { SAVED_CONTACTS_PATH, userMovementsPath } from "@/lib/api-paths";
import { roundMoney } from "@/lib/format";
import { addMovement } from "@/lib/movements";
import { addSavedContact, getCreatedContacts } from "@/lib/contacts";
import { getUser } from "@/lib/users";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import type { SavedContact } from "@/types/types";

export async function sendTransaction(
  prevState: undefined | { error: string },
  formData: FormData,
) {
  const session = await getSession();
  if (!session) redirect("/login");

  const cantidad = formData.get("Cantidad");
  const motivo = formData.get("Motivo");
  const contacto = formData.get("Contacto");
  const amount = Number(cantidad);

  if (!cantidad || !Number.isFinite(amount) || amount <= 0) {
    return { error: "La cantidad debe ser mayor a 0" };
  }
  if (!motivo || !String(motivo).trim()) {
    return { error: "El motivo es requerido" };
  }

  if (!contacto || !String(contacto).trim()) {
    return { error: "El contacto es requerido" };
  }

  const user = await getUser(session);
  if (amount > user.balance) {
    return { error: `Fondos insuficientes, te faltan ${roundMoney(amount - user.balance)} pesos` };
  }

  const params = new URLSearchParams({
    cantidad: String(amount),
    motivo: String(motivo).trim(),
    contacto: String(contacto ?? ""),
  });

  let response: Response;
  const transactionId = Date.now();
  try {
    response = await apiPost(userMovementsPath(session), {
      cantidad: amount,
      motivo: String(motivo).trim(),
      contacto,
    });
  } catch {
    redirect(`/transactions/confirmation/520/${transactionId}?${params}`);
  }

  addMovement(session, {
    id: transactionId,
    transactionId: String(transactionId),
    description: `Envio a ${String(contacto).trim()}`,
    amount,
    date: new Date().toISOString().slice(0, 10),
    extra: String(motivo).trim(),
    status: response.ok ? "completed" : "failed",
  });
  updateTag("user");
  redirect(`/transactions/confirmation/${response.status}/${transactionId}?${params}`);
}

export async function getSavedContacts(): Promise<SavedContact[]> {
  const session = await getSession();
  if (!session) redirect("/login");
  const response = await apiGet(SAVED_CONTACTS_PATH);
  const body = await response.json();
  return [...(body.data ?? []), ...getCreatedContacts()];
}

export async function saveContact(
  name: string,
  email: string,
): Promise<SavedContact> {
  const session = await getSession();
  if (!session) redirect("/login");
  const contact: SavedContact = { id: Date.now(), name, email };
  addSavedContact(contact);
  return contact;
}
