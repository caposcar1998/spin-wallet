import { userPath } from "@/lib/api-paths";
import { proxyToMock } from "@/lib/mock-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyToMock(userPath(id));
}
