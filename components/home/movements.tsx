"use server";

import Link from "next/link";
import { CustomButton } from "../general/button";
import TableMovements from "./tableMovements";
import { getSession } from "@/lib/session";
import { getUser } from "@/app/home/actions";
import { Title } from "@/components/general/title";

export default async function Movements() {
  const session = await getSession();
  const user = session ? await getUser(session) : null;

  return (
    <div>
      <Title>Movimientos</Title>

      <div className="relative bg-white shadow-sm rounded-lg border border-gray-200">
        <TableMovements movements={user?.movements ?? []} />
      </div>
      <div className="flex justify-center mt-15">
        <Link href="/transactions">
          <CustomButton message="Nueva transacción" />
        </Link>
      </div>
    </div>
  );
}
