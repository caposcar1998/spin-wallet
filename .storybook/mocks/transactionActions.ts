import { flow, wait } from "./flow";
import type { SavedContact } from "../../types/types";

export async function getSavedContacts(): Promise<SavedContact[]> {
  await wait(50);
  return flow.contacts;
}

export async function sendTransaction(_prev: unknown, formData: FormData) {
  await wait(flow.transactionDelay);
  if (flow.transactionError) {
    return { error: flow.transactionError };
  }
  flow.onTransaction?.(flow.transactionStatus, {
    cantidad: String(formData.get("Cantidad") ?? ""),
    motivo: String(formData.get("Motivo") ?? ""),
    contacto: String(formData.get("Contacto") ?? ""),
  });
  return undefined;
}
