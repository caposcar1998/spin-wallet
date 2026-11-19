import { SAVED_CONTACTS_PATH } from "@/lib/api-paths";
import { proxyToMock } from "@/lib/mock-api";

export async function GET() {
  return proxyToMock(SAVED_CONTACTS_PATH);
}
