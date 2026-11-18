import { getSession } from "@/lib/session";
import { logout } from "@/components/actions";
import Image from "next/image";
import spinLogo from "@/public/spin.jpeg";
import { Suspense } from "react";
import { Title } from "@/components/title";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-blue-500">
      <div className="flex items-center gap-2">
        <Image src={spinLogo} alt="Spin wallet" width={50} height={50} />
        <Title size="sm">Spin wallet</Title>
      </div>
      <Suspense fallback={<h2>La cartera de tus sueños</h2>}>
        <HeaderSession />
      </Suspense>
    </header>
  );
}

async function HeaderSession() {
  const session = await getSession();

  return session ? (
    <form action={logout}>
      <button type="submit">Logout</button>
    </form>
  ) : (
    <h2>La cartera de tus sueños</h2>
  );
}
