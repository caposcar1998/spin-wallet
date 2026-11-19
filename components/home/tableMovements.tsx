"use client";

import Link from "next/link";
import { useState } from "react";
import { CustomButton } from "../general/button";
import { CustomInput } from "../general/input";
import { formatCurrency } from "@/lib/format";
import type { Movement } from "@/types/types";
import { GeneralText } from "../general/generalText";
import { SubTitle } from "../general/subTitle";

export const MAX_VISIBLE_ROWS = 6;
// ~53px por fila (py-4 + text-sm + border) → MAX_VISIBLE_ROWS filas visibles, el resto con scroll
export const SCROLL_MAX_HEIGHT = `${MAX_VISIBLE_ROWS * 53}px`;

export default function TableMovements({
  movements,
}: {
  movements: Movement[];
}) {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const filtered = search
    ? movements.filter((movement) =>
        [
          movement.description,
          movement.extra,
          movement.date,
          String(movement.amount),
        ].some((field) => field.toLowerCase().includes(search)),
      )
    : movements;

  if (movements.length === 0) {
    return (
      <SubTitle testId="movements-empty" className="text-center">
        No hay movimientos
      </SubTitle>
    );
  }

  return (
    <>
      <div className="px-4 pt-4 md:px-6">
        <CustomInput
          name="Buscar"
          type="search"
          testId="movements-search-input"
          placeholder="Descripción, motivo, monto o fecha…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <SubTitle testId="movements-search-empty" className="p-4 text-center">
          Sin resultados
        </SubTitle>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <ul
            data-testid="movements-list"
            className="md:hidden divide-y divide-gray-200 overflow-y-auto"
            style={{ maxHeight: SCROLL_MAX_HEIGHT }}
          >
            {filtered.map((movement) => (
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
          <div
            data-testid="movements-table-scroll"
            className="hidden md:block overflow-y-auto"
            style={{ maxHeight: SCROLL_MAX_HEIGHT }}
          >
            <table
              data-testid="movements-table"
              className="w-full text-sm text-left rtl:text-right text-gray-600"
            >
              <thead className="sticky top-0 z-10 text-xs uppercase tracking-wide text-primary bg-surface-strong border-b border-gray-200">
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
                {filtered.map((movement) => (
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
          </div>
        </>
      )}
    </>
  );
}
