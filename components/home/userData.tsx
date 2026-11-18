"use server";

import { getSession } from "@/lib/session";
import { getUser } from "@/app/home/actions";
import { Title } from "@/components/general/title";

export default async function UserData() {
  const session = await getSession();
  const user = session ? await getUser(session) : null;
  return (
    <div>
      <Title>Bienvenido {user?.name}</Title>
      <Title size="sm">Tu saldo disponible es de ${user?.balance}</Title>
    </div>
  );
}
