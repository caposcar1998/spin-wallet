import { Title } from "@/components/general/title";
import { GeneralText } from "@/components/general/generalText";
import { errors } from "@/types/types";

export default async function Confirmation({
  params,
}: {
  params: Promise<{ status: string; id: string }>;
}) {
  const { status, id } = await params;

  const error = errors[status as keyof typeof errors];

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <Title>Transacción enviada</Title>
      <GeneralText>Estado: {error}</GeneralText>
      <GeneralText>ID: {id}</GeneralText>
    </div>
  );
}
