import { flow, wait } from "./flow";

export async function loginUser(_prev: unknown, formData: FormData) {
  await wait(flow.loginDelay);
  const user = String(formData.get("user") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!/^(?:[^\s@]+@[^\s@]+\.[^\s@]+|\d{10,15})$/.test(user)) {
    return { error: "Formato invalido para correo/telefono" };
  }
  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres" };
  }
  if (flow.loginError) {
    return { error: flow.loginError };
  }
  flow.onLoginSuccess?.();
  return undefined;
}
