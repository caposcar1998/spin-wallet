import { proxyToMock } from "@/lib/mock-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyToMock(`/user/${id}/movements`);
}

function jsonError(error: string, status: number) {
  return Response.json({ error }, { status });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const random = Math.floor(Math.random() * 20);
  if (process.env.API_CHAOS !== "false" && random >= 5) {
    if (random < 8) return jsonError("Error en red", 500);
    if (random < 12) return jsonError("Fondos insuficientes", 400);
    if (random < 16) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return jsonError("Timeout de red", 408);
    }
    return jsonError("Error desconocido", 520);
  }
  const body = await request.text();
  return proxyToMock(`/user/${id}/movements`, {
    method: "POST",
    headers: {
      "Content-Type":
        request.headers.get("Content-Type") ?? "application/json",
    },
    body,
  });
}
