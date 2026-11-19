import { getSession } from "@/lib/session";
import { getMovements } from "@/lib/users";
import { formatCurrency } from "@/lib/format";
import { Title } from "@/components/general/title";
import { DetailTable } from "@/components/general/detailTable";

export const instant = false;

export default async function Transaction({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const movements = session ? await getMovements(session) : [];
  const movement = movements.find((m) => m.id === Number(id));
  const movementStatusSpanish = movement?.status === 'completed' ? 'completado' : 'fallido';

  if (!movement) {
    return (
      <Title size="sm" className="flex justify-center items-center">
        Movimiento no encontrado
      </Title>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <Title>{movement.description}</Title>
      <DetailTable
        className="w-full max-w-md"
        rows={[
          { label: "Monto", value: formatCurrency(movement.amount) },
          { label: "Fecha", value: movement.date },
          { label: "Estado", value: movementStatusSpanish },
          { label: "Descripción", value: movement.extra },
          { label: "ID de transacción", value: movement.transactionId },
        ]}
      />
    </div>
  );
}
