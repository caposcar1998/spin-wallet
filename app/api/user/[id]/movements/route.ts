import { userMovementsPath } from "@/lib/api-paths";
import { proxyToMock } from "@/lib/mock-api";

const CHAOS_DELAY_MS = process.env.CHAOS_DELAY_MS
  ? Number(process.env.CHAOS_DELAY_MS)
  : 0;

const CHAOS_408_DELAY_MS = process.env.CHAOS_408_DELAY_MS
  ? Number(process.env.CHAOS_408_DELAY_MS)
  : 3_000;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyToMock(userMovementsPath(id));
}

function jsonError(error: string, status: number) {
  return Response.json({ error }, { status });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const error = await simulateError();
  if (error) return error;

  const body = await request.text();
  return proxyToMock(userMovementsPath(id), {
    method: "POST",
    headers: {
      "Content-Type":
        request.headers.get("Content-Type") ?? "application/json",
    },
    body,
  });
}

async function simulateError(): Promise<Response | undefined> {
  const random = Math.floor(Math.random() * 20);
  if (process.env.API_CHAOS !== "false") {
    await new Promise((resolve) => setTimeout(resolve, CHAOS_DELAY_MS));
    if (random >= 5) {
      if (random < 8) return jsonError("Error en red", 500);
      if (random < 12) return jsonError("Fondos insuficientes", 400);
      if (random < 16) {
        await new Promise((resolve) => setTimeout(resolve, CHAOS_408_DELAY_MS));
        return jsonError("Timeout de red", 408);
      }
      return jsonError("Error desconocido", 520);
    }
  }
  return undefined;
}
