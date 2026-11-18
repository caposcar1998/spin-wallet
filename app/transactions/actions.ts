"use server";

import { apiPost } from "@/lib/api";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function sendTransaction(
  prevState: undefined | { error: string },
  formData: FormData,
) {
  const session = await getSession();
  const cantidad = formData.get("Cantidad");
  const motivo = formData.get("Motivo");

  if (!cantidad || Number(cantidad) <= 0) {
    return { error: "La cantidad debe ser mayor a 0" };
  }
  if (!motivo) {
    return { error: "El motivo es requerido" };
  }

  const response = await apiPost(`/user/${session}/movements`, {
    cantidad,
    motivo,
  });

  if (!response.ok) {
    return { error: "No se pudo enviar la transacción" };
  }

  redirect("/home");
}
