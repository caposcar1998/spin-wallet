"use client";

import { Alert } from "@/components/alert";
import { loginUser } from "./actions";
import { useActionState, useEffect, useState } from "react";
import { CustomButton } from "@/components/general/button";
import { CustomInput } from "@/components/general/input";
import { Title } from "@/components/general/title";

export default function Login() {
  const [state, formAction, isPending] = useActionState(loginUser, undefined);
  const [closeAlert, setCloseAlert] = useState(false);

  useEffect(() => {
    setCloseAlert(false);
  }, [state]);

  return (
    <>
    <div className="flex flex-1 flex-col items-center justify-center">
    <Title size="lg">Login</Title>
    </div>
    <div className="flex flex-1 flex-col items-center">
      <form action={formAction}>
        <CustomInput type="text" name="user" required />
        <div className="h-2" />
        <CustomInput type="password" name="password" required />
        <div className="h-2" />
        <CustomButton
          type="submit"
          disabled={isPending}
          className="w-full"
          message={isPending ? "Cargando…" : "Login"}
        />
        {state?.error && !closeAlert && (
          <Alert type="error" isOpen={true} onClose={() => setCloseAlert(true)}>
            <p>{state.error}</p>
          </Alert>
        )}
      </form>
    </div>
    </>
  );
}
