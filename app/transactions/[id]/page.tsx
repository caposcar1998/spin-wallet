import { getSession } from "@/lib/session";
import { getUser } from "@/app/home/actions";
import { Title } from "@/components/title";

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
    <div>
      <Title>{movement.description}</Title>
      <p className="text-2xl">Monto: ${movement.amount}</p>
      <p>Fecha: {movement.date}</p>
      <p>{movement.extra}</p>
    </div>
  );
}
