import { proxyToMock } from "@/lib/mock-api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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
