import { describe, it, expect, vi, afterEach } from "vitest";
import { proxyToMock } from "./mock-api";
import { USERS_PATH } from "./api-paths";

describe("proxyToMock", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns 504 when the upstream times out", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockRejectedValue(
          new DOMException("upstream timeout", "TimeoutError"),
        ),
    );
    const response = await proxyToMock(USERS_PATH);
    expect(response.status).toBe(504);
    await expect(response.json()).resolves.toEqual({
      error: "Mock API timeout",
    });
  });

  it("returns 502 when the upstream is unreachable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("connect ECONNREFUSED")),
    );
    const response = await proxyToMock(USERS_PATH);
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: "Mock API unavailable",
    });
  });

  it("proxies the upstream status and body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
    const response = await proxyToMock(USERS_PATH);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ data: [] });
  });
});
