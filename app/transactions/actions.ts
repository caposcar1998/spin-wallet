"use server";

import { apiGet, apiPost } from "@/lib/api";
import { addMovement } from "@/lib/movements";
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
    return { error: `Fondos insuficientes, te faltan ${amount - user.balance} pesos` };
  }

  const params = new URLSearchParams({
    cantidad: String(amount),
    motivo: String(motivo).trim(),
    contacto: String(contacto ?? ""),
  });

  let response: Response;
  try {
    response = await apiPost(`/user/${session}/movements`, {
      cantidad: amount,
      motivo: String(motivo).trim(),
      contacto,
    });
  } catch {
    redirect(`/transactions/confirmation/520/123456?${params}`);
  }

  addMovement(session, {
    id: Date.now(),
    description: `Envio a ${String(contacto).trim()}`,
    amount,
    date: new Date().toISOString().slice(0, 10),
    extra: String(motivo).trim(),
    status: response.ok ? "completed" : "failed",
  });
  updateTag("user");
  redirect(`/transactions/confirmation/${response.status}/123456?${params}`);
}

export async function getSavedContacts(): Promise<SavedContact[]> {
  const response = await apiGet("/saved-contacts");
  const body = await response.json();
  return body.data ?? [];
}
