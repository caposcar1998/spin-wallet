import { cookies } from "next/headers";

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("userId")?.value ?? null;
}

export async function setSession(session: string) {
  const cookieStore = await cookies();
  cookieStore.set("userId", session);
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
}
