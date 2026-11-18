import { Title } from "@/components/general/title";
import { GeneralText } from "@/components/general/generalText";
import { errors } from "@/types/types";

export default async function Confirmation({
  params,
  searchParams,
}: {
  params: Promise<{ status: string; id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { status, id } = await params;
  const { cantidad, motivo, contacto } = await searchParams;

  const error = errors[status as keyof typeof errors];

  const motivoError =
    status === "500"
      ? "Reintentar"
      : status === "400"
        ? "Fondos insuficientes"
        : status === "408"
          ? "Timeout de red"
          : status === "520"
            ? "Error desconocido"
            : error;

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <Title>Transacción {status !== "201" ? "fallida" : "exitosa"}</Title>
      {motivoError && <GeneralText>Estado: {motivoError}</GeneralText>}
      <GeneralText>Monto: ${cantidad}</GeneralText>
      <GeneralText>Motivo: {motivo}</GeneralText>
      <GeneralText>Contacto: {contacto}</GeneralText>
      <GeneralText>ID: {id}</GeneralText>
    </div>
  );
}
