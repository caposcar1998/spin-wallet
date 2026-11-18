import { Suspense } from "react";
import UserData from "@/components/home/userData";
import Movements from "@/components/home/movements";

export default async function Home() {
  return (
    <div data-testid="home-screen">
      <Suspense fallback={<p data-testid="user-loading">Cargando…</p>}>
        <UserData />
      </Suspense>
      <div className="h-4"></div>
      <Suspense fallback={<p data-testid="movements-loading">Cargando…</p>}>
        <Movements />
      </Suspense>
    </div>
  );
}
