import { Title } from "@/components/general/title";
import { DetailTable } from "@/components/general/detailTable";
import { errors } from "@/types/types";
import { ActionTransaction } from "./actionTransaction";

export const instant = false;

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
    <div data-testid="confirmation-screen" className="flex flex-col gap-4 items-center justify-center">
      <Title testId="confirmation-title">Transacción {status !== "201" ? "fallida" : "exitosa"}</Title>
      <DetailTable
        className="w-full max-w-md"
        rows={[
          ...(motivoError ? [{ label: "Estado", value: motivoError }] : []),
          { label: "Monto", value: cantidad ? `$${cantidad}` : "—" },
          { label: "Motivo", value: motivo ?? "—" },
          { label: "Contacto", value: contacto ?? "—" },
          { label: "ID", value: id },
        ]}
      />
      <ActionTransaction
        cantidad={cantidad ?? ""}
        motivo={motivo ?? ""}
        contacto={contacto ?? ""}
        status={status}
      />
    </div>
  );
}
