"use server";

import { apiGet, apiPost } from "@/lib/api";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";

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

  const response = await apiPost(`/user/${session}/movements`, {
    cantidad: amount,
    motivo: String(motivo).trim(),
    contacto,
  });

  updateTag("user");
  const params = new URLSearchParams({
    cantidad: String(amount),
    motivo: String(motivo).trim(),
    contacto: String(contacto ?? ""),
  });
  redirect(`/transactions/confirmation/${response.status}/123456?${params}`);
}

export interface SavedContact {
  id: number;
  name: string;
  email: string;
}

export async function getSavedContacts(): Promise<SavedContact[]> {
  const response = await apiGet("/saved-contacts");
  const body = await response.json();
  return body.data ?? [];
}
