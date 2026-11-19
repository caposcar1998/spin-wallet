"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUsers } from "@/lib/users";

export async function loginUser(
  _: undefined | { error: string },
  formData: FormData,
) {
  const userEmail = String(formData.get("user") ?? "");
  const userPassword = String(formData.get("password") ?? "");

  if (!validateUser(userEmail)) {
    return { error: "Formato invalido para correo/telefono" };
  }
  if (!validatePassword(userPassword)) {
    return { error: "La contraseña debe tener al menos 8 caracteres" };
  }
  const users = await getUsers();
  if (!users) {
    return { error: "Error al obtener los usuarios" };
  }
  const foundUser = users.find(
    (user) => user.email === userEmail || user.phone === userEmail,
  );
  if (!foundUser) {
    return { error: "Usuario no registrado" };
  }

  const cookieStore = await cookies();
  cookieStore.set("userId", foundUser.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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
