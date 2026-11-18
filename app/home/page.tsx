"use server";

import { Suspense } from "react";
import UserData from "@/components/home/userData";
import Movements from "@/components/home/movements";

export default async function Home() {
  return (
    <div>
      <Suspense fallback={<p>Cargando…</p>}>
        <UserData />
      </Suspense>
      <div className="h-4"></div>
      <Suspense fallback={<p>Cargando…</p>}>
        <Movements />
      </Suspense>
    </div>
  );
}
