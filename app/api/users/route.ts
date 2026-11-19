import { USERS_PATH } from "@/lib/api-paths";
import { proxyToMock } from "@/lib/mock-api";

export async function GET() {
  return proxyToMock(USERS_PATH);
}
