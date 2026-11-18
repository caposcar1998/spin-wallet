import { getSession } from "@/lib/session";
import { getUser } from "@/app/home/actions";
import { Title } from "@/components/general/title";
import { GeneralText } from "@/components/general/generalText";

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
      <div className="w-full max-w-md bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-600">
          <tbody>
            <tr className="border-b border-gray-200">
              <th scope="row" className="px-6 py-4">
                <GeneralText>Monto</GeneralText>
              </th>
              <td className="px-6 py-4"><GeneralText>${movement.amount}</GeneralText></td>
            </tr>
            <tr className="border-b border-gray-200">
              <th scope="row" className="px-6 py-4">
                <GeneralText>Fecha</GeneralText>
              </th>
              <td className="px-6 py-4"><GeneralText>{movement.date}</GeneralText></td>
            </tr>
            <tr>
              <th scope="row" className="px-6 py-4">
                <GeneralText>Descripción</GeneralText>
              </th>
              <td className="px-6 py-4"><GeneralText>{movement.extra}</GeneralText></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
