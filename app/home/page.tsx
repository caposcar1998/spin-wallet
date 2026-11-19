import { Suspense } from "react";
import UserData from "@/components/home/userData";
import Movements from "@/components/home/movements";
import { GeneralText } from "@/components/general/generalText";

export default async function Home() {
  return (
    <div data-testid="home-screen" className="pb-8">
      <Suspense fallback={<p data-testid="user-loading">Cargando…</p>}>
        <UserData />
      </Suspense>
      <div className="mx-4 mt-6 rounded-2xl bg-white shadow-md overflow-hidden">
        <Suspense fallback={<GeneralText data-testid="movements-loading">Cargando…</GeneralText>}>
          <Movements />
        </Suspense>
      </div>
    </div>
  );
}
