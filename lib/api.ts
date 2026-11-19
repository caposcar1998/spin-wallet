const API_BASE_URL =
  process.env.USERS_API_BASE_URL ?? "http://localhost:3000/api";

export async function apiGet(path: string) {
  return fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
}

export async function apiPost(path: string, body: Record<string, unknown>) {
  return fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
}
