import Link from "next/link";
import { CustomButton } from "../general/button";
import { formatCurrency } from "@/lib/format";
import type { Movement } from "@/types/types";
import { GeneralText } from "../general/generalText";
import { SubTitle } from "../general/subTitle";

export default function TableMovements({
  movements,
}: {
  movements: Movement[];
}) {
  if (movements.length === 0) {
    return (
      <SubTitle testId="movements-empty" className="text-center">
        No hay movimientos
      </SubTitle>
    );
  }

  return (
    <>
      {/* Mobile: stacked cards */}
      <ul data-testid="movements-list" className="md:hidden divide-y divide-gray-200">
        {movements.map((movement) => (
          <li key={movement.id} data-testid="movement-item" className="p-4">
            <h3 className="font-medium text-gray-900">{movement.description}</h3>
            <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">Monto:</span> {formatCurrency(movement.amount)}
              </p>
              <p>
                <span className="font-medium">Fecha:</span> {movement.date}
              </p>
              <p>
                <span className="font-medium">Estado:</span> {movement.status === "completed" ? "✅" : "❌"}
              </p>
            </div>
            <div className="mt-3">
              <Link href={`/transactions/${movement.id}`}>
                <CustomButton testId="movement-view-button" message="Ver" />
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop and up: table */}
      <table data-testid="movements-table" className="hidden md:table w-full text-sm text-left rtl:text-right text-gray-600">
        <thead className="text-xs uppercase tracking-wide text-primary bg-surface-strong border-b border-gray-200">
          <tr>
            <th scope="col" className="px-6 py-3 font-medium">
              <GeneralText>Descripción</GeneralText>
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              <GeneralText>Monto</GeneralText>
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              <GeneralText>Fecha</GeneralText>
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              <GeneralText>Estado</GeneralText>
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              <GeneralText>Revisar</GeneralText>
            </th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => (
            <tr
              key={movement.id}
              data-testid="movement-row"
              className="bg-white border-b border-gray-200 last:border-0 transition-colors hover:bg-surface"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                <GeneralText>{movement.description}</GeneralText>
              </th>
              <td className="px-6 py-4">
                <GeneralText>{formatCurrency(movement.amount)}</GeneralText>
              </td>
              <td className="px-6 py-4">
                <GeneralText>{movement.date}</GeneralText>
              </td>
              <td className="px-6 py-4">
                <GeneralText>{movement.status === "completed" ? "✅" : "❌"}</GeneralText>
              </td>
              <td className="px-6 py-4">
                <Link href={`/transactions/${movement.id}`}>
                  <CustomButton testId="movement-view-button" message="Ver" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
