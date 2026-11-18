import { proxyToMock } from "@/lib/mock-api";

export async function GET() {
  return proxyToMock("/users");
}
