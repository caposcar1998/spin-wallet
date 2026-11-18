const API_BASE_URL = process.env.USERS_API_BASE_URL ?? "http://localhost:8080";

export async function apiGet(path: string) {
  return fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
}

export async function apiPost(path: string, body: any) {
  return fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
}
