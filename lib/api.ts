const API_BASE_URL = process.env.USERS_API_BASE_URL ?? "http://localhost:8080";
export async function apiGet(path: string) {
  return fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
}

export async function apiPost(path: string, body: Record<string, unknown>) {
  const random = Math.floor(Math.random() * 20);
  if (process.env.API_CHAOS === "false" || random < 5) {
      return fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  }
  else if (random < 8) {
    return new Response(
      JSON.stringify({ error: "Error en red" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
  else if (random < 12) {
    return new Response(
      JSON.stringify({ error: "Fondos insuficientes" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
  else if (random < 16) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    return new Response(
      JSON.stringify({ error: "Timeout de red" }),
      { status: 408, headers: { "Content-Type": "application/json" } },
    );
  }
  else {
    return new Response(
      JSON.stringify({ error: "Error desconocido" }),
      { status: 520, headers: { "Content-Type": "application/json" } },
    );
  }

}
