import { getSession } from "@/lib/session";
import { getUser } from "@/lib/users";
import { Title } from "@/components/general/title";

export default async function UserData() {
  const session = await getSession();
  const user = session ? await getUser(session) : null;
  return (
    <div className="mx-4 mt-6 rounded-2xl bg-gradient-to-br from-primary to-primary-light p-6 text-white shadow-lg">
      <Title testId="user-name" size="sm" className="text-white">
        Bienvenido {user?.name}
      </Title>
      <p className="mt-3 text-sm text-white/80">Tu saldo disponible</p>
      <Title testId="user-balance" className="text-white">
        ${user?.balance}
      </Title>
    </div>
  );
}
