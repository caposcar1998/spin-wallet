import { getSession } from "@/lib/session";
import { getUser } from "@/lib/users";
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
  const user = session ? await getUser(session) : null;
  const movement = user?.movements.find((m) => m.id === Number(id));

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
          { label: "Monto", value: `$${movement.amount}` },
          { label: "Fecha", value: movement.date },
          { label: "Estado", value: movement.status },
          { label: "Descripción", value: movement.extra },
        ]}
      />
    </div>
  );
}
