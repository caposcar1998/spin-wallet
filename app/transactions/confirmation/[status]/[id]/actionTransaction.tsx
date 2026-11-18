"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { sendTransaction } from "@/app/transactions/actions";
import { CustomButton } from "@/components/general/button";

export function ActionTransaction({
  cantidad,
  motivo,
  contacto,
  status,
}: {
  cantidad: string;
  motivo: string;
  contacto: string;
  status: string;
}) {
  const [state, formAction, isPending] = useActionState(
    sendTransaction,
    undefined,
  );
  const router = useRouter();

  return (
    <div>
        {status === "408" && (
    <form action={formAction} className="flex flex-col items-center gap-2">
      <input type="hidden" name="Cantidad" value={cantidad} />
      <input type="hidden" name="Motivo" value={motivo} />
      <input type="hidden" name="Contacto" value={contacto} />
      <CustomButton
        type="submit"
        disabled={isPending}
        testId="retry-button"
        message={isPending ? "Reintentando…" : "Reintentar"}
      />
      {state?.error && <p data-testid="retry-error-message" className="text-sm text-red-600">{state.error}</p>}
    </form>
        )}
    <CustomButton testId="back-to-transactions-button" message="Regresar" onClick={() => router.push("/transactions")} />
    </div>
  );
}
