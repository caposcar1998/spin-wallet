import Link from "next/link";
import { CustomButton } from "../general/button";
import TableMovements from "./tableMovements";
import { getSession } from "@/lib/session";
import { getMovements } from "@/lib/users";
import { Title } from "@/components/general/title";

export default async function Movements() {
  const session = await getSession();
  const movements = session ? await getMovements(session) : [];

  return (
    <div>
      <Title>Movimientos</Title>

      <div className="relative bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="flex justify-center mt-4 mb-4">
        <Link href="/transactions">
          <CustomButton testId="new-transaction-button" message="Nueva transacción" />
        </Link>
      </div>
        <TableMovements movements={movements} />
      </div>
    </div>
  );
}
