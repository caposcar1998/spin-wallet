import { Suspense } from "react";
import UserData from "@/components/home/userData";
import Movements from "@/components/home/movements";

export default async function Home() {
  return (
    <div data-testid="home-screen" className="pb-8">
      <Suspense fallback={<p data-testid="user-loading">Cargando…</p>}>
        <UserData />
      </Suspense>
      <div className="mx-4 mt-6 rounded-2xl bg-white shadow-md overflow-hidden">
        <Suspense fallback={<p data-testid="movements-loading">Cargando…</p>}>
          <Movements />
        </Suspense>
      </div>
    </div>
  );
}
