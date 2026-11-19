const API_BASE_URL =
  process.env.USERS_API_BASE_URL ?? "http://localhost:3000/api";

const API_TIMEOUT_MS = process.env.API_TIMEOUT_MS
  ? Number(process.env.API_TIMEOUT_MS)
  : 10_000;

export async function apiGet(path: string) {
  return fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });
}

export async function apiPost(path: string, body: Record<string, unknown>) {
  return fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });
}
