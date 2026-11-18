import Link from "next/link";
import { CustomButton } from "../button";
import { Movement } from "@/app/home/actions";

export default function TableMovements({
  movements,
}: {
  movements: Movement[];
}) {
  return (
    <table className="w-full text-sm text-left rtl:text-right text-body">
      <thead className="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default">
        <tr>
          <th scope="col" className="px-6 py-3 font-medium">
            Descripción
          </th>
          <th scope="col" className="px-6 py-3 font-medium">
            Monto
          </th>
          <th scope="col" className="px-6 py-3 font-medium">
            Fecha
          </th>
          <th scope="col" className="px-6 py-3 font-medium">
            Revisar
          </th>
        </tr>
      </thead>
      <tbody>
        {movements.map((movement) => (
          <tr
            key={movement.id}
            className="bg-neutral-primary border-b border-default last:border-0"
          >
            <th
              scope="row"
              className="px-6 py-4 font-medium text-heading whitespace-nowrap"
            >
              {movement.description}
            </th>
            <td className="px-6 py-4">${movement.amount}</td>
            <td className="px-6 py-4">{movement.date}</td>
            <td className="px-6 py-4">
              <Link href={`/transactions/${movement.id}`}>
                <CustomButton message="Ver" />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
