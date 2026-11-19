import { Title } from "@/components/general/title";
import { DetailTable } from "@/components/general/detailTable";
import { formatCurrency } from "@/lib/format";
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

  const motivoError = errors[status as keyof typeof errors];

  return (
    <div data-testid="confirmation-screen" className="flex flex-1 flex-col gap-4 items-center justify-center px-4">
      <Title testId="confirmation-title" className={status !== "201" ? "text-red-600" : "text-primary"}>
        Transacción {status !== "201" ? "fallida" : "exitosa"}
      </Title>
      <DetailTable
        className="w-full max-w-md"
        rows={[
          ...(motivoError ? [{ label: "Estado", value: motivoError }] : []),
          { label: "Monto", value: cantidad ? formatCurrency(Number(cantidad)) : "—" },
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
