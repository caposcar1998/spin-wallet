import { getSession } from "@/lib/session";
import { logout } from "@/components/actions";
import Image from "next/image";
import spinLogo from "@/public/spin.jpeg";
import { Suspense } from "react";
import { Title } from "@/components/general/title";
import { GeneralText } from "./general/generalText";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-secondary">
      <div className="flex items-center gap-2">
        <Image src={spinLogo} alt="Spin wallet" width={50} height={50} />
        <Title size="sm">Spin wallet</Title>
      </div>
      <Suspense fallback={<GeneralText>La cartera de tus sueños</GeneralText>}>
        <HeaderSession />
      </Suspense>
    </header>
  );
}

async function HeaderSession() {
  const session = await getSession();

  return session ? (
    <form action={logout}>
      <button type="submit" data-testid="logout-button">
        <GeneralText>Logout</GeneralText>
      </button>
    </form>
  ) : (
    <GeneralText>La cartera de tus sueños</GeneralText>
  );
}
