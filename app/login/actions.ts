"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function loginUser(
  prevState: undefined | { error: string },
  formData: FormData,
) {
  const userEmail = formData.get("user") as string;
  const userPassword = formData.get("password") as string;

  if (!validateUser(userEmail)) {
    return { error: "Formato invalido para correo/telefono" };
  }
  if (!validatePassword(userPassword)) {
    return { error: "La contraseña debe tener al menos 8 caracteres" };
  }

  const cookieStore = await cookies();
  cookieStore.set("userId", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 5 * 60,
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));
  redirect("/home");
}

function validateUser(user: string) {
  const userEmail = /^(?:[^\s@]+@[^\s@]+\.[^\s@]+|\d{10,15})$/;
  return userEmail.test(user);
}

function validatePassword(password: string) {
  return password.length >= 8;
}
