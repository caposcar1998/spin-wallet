import { getSession } from "@/lib/session";
import { logout } from "@/components/actions";
import Image from "next/image";
import Link from "next/link";
import spinLogo from "@/public/spin.jpeg";
import { Suspense } from "react";
import { Title } from "@/components/general/title";
import { GeneralText } from "./general/generalText";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-primary shadow-md">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Image src={spinLogo} alt="Spin wallet" width={44} height={44} className="rounded-lg" data-testid="spin-logo" />
          <Title size="sm" className="text-white">Spin wallet</Title>
        </Link>
      </div>
      <Suspense fallback={<GeneralText className="text-white/80">La cartera de tus sueños</GeneralText>}>
        <HeaderSession />
      </Suspense>
    </header>
  );
}

async function HeaderSession() {
  const session = await getSession();

  return session ? (
    <form action={logout}>
      <button
        type="submit"
        data-testid="logout-button"
        className="rounded-full border border-white/40 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10 cursor-pointer"
      >
        Logout
      </button>
    </form>
  ) : (
    <GeneralText className="text-white/80">La cartera de tus sueños</GeneralText>
  );
}
