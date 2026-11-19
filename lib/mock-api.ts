const MOCK_API_URL = process.env.MOCK_API_URL ?? "http://localhost:8080";

export async function proxyToMock(path: string, init?: RequestInit) {
  try {
    const upstream = await fetch(`${MOCK_API_URL}${path}`, {
      cache: "no-store",
      ...init,
      signal: AbortSignal.timeout(5_000),
    });
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      return Response.json({ error: "Mock API timeout" }, { status: 504 });
    }
    return Response.json({ error: "Mock API unavailable" }, { status: 502 });
  }
}
