"use server";

import Link from "next/link";
import { CustomButton } from "../button";
import TableMovements from "./tableMovements";
import { getSession } from "@/lib/session";
import { getUser } from "@/app/home/actions";
import { Title } from "@/components/title";

export default async function Movements() {
  const session = await getSession();
  const user = session ? await getUser(session) : null;

  return (
    <div>
      <Title>Movements</Title>

      <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
        <TableMovements movements={user?.movements ?? []} />
      </div>
      <div className="flex justify-center">
        <Link href="/transactions">
          <CustomButton message="Nueva transacción" />
        </Link>
      </div>
    </div>
  );
}
