const MOCK_API_URL = process.env.MOCK_API_URL ?? "http://localhost:8080";

export async function proxyToMock(path: string, init?: RequestInit) {
  try {
    const upstream = await fetch(`${MOCK_API_URL}${path}`, {
      cache: "no-store",
      ...init,
    });
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return Response.json({ error: "Mock API unavailable" }, { status: 502 });
  }
}
