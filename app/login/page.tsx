"use client";

import { Alert } from "@/components/alert";
import { loginUser } from "./actions";
import { useActionState, useState } from "react";
import { CustomButton } from "@/components/general/button";
import { CustomInput } from "@/components/general/input";
import { Title } from "@/components/general/title";

export default function Login() {
  const [state, formAction, isPending] = useActionState(loginUser, undefined);
  const [closeAlert, setCloseAlert] = useState(false);

  const [prevActionState, setPrevActionState] = useState(state);
  if (state !== prevActionState) {
    setPrevActionState(state);
    setCloseAlert(false);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <Title size="sm" className="mb-6 text-center text-primary">Login</Title>
      <form action={formAction} data-testid="login-form">
        <CustomInput type="text" name="user" required testId="login-user-input" />
        <div className="h-3" />
        <CustomInput type="password" name="password" required testId="login-password-input" />
        <div className="h-5" />
        <CustomButton
          type="submit"
          disabled={isPending}
          className="w-full"
          testId="login-submit-button"
          message={isPending ? "Cargando…" : "Login"}
        />
        {state?.error && !closeAlert && (
          <Alert type="error" isOpen={true} onClose={() => setCloseAlert(true)}>
            <p>{state.error}</p>
          </Alert>
        )}
      </form>
      </div>
    </div>
  );
}
