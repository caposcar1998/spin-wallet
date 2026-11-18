"use client";

import { Title } from "@/components/title";
import { Alert } from "@/components/alert";
import { useActionState, useEffect, useState } from "react";
import { CustomButton } from "@/components/button";
import { CustomInput } from "@/components/input";
import { sendTransaction } from "./actions";

export default function Transactions() {
  const [state, formAction, isPending] = useActionState(
    sendTransaction,
    undefined,
  );
  const [closeAlert, setCloseAlert] = useState(false);

  useEffect(() => {
    setCloseAlert(false);
  }, [state]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Title size="lg">Enviar Transacción</Title>
      <form action={formAction}>
        <CustomInput type="number" name="Cantidad" required />
        <div className="h-2" />
        <CustomInput type="text" name="Motivo" required />
        <div className="h-2" />
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
    </div>
  );
}
