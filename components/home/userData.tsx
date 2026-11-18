import { getSession } from "@/lib/session";
import { getUser } from "@/lib/users";
import { Title } from "@/components/general/title";

export default async function UserData() {
  const session = await getSession();
  const user = session ? await getUser(session) : null;
  return (
    <div>
      <Title testId="user-name">Bienvenido {user?.name}</Title>
      <Title testId="user-balance" size="sm">Tu saldo disponible es de ${user?.balance}</Title>
    </div>
  );
}
