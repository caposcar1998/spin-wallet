import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendTransaction } from "./actions";
import { apiPost } from "@/lib/api";
import { getUser } from "@/lib/users";
import { getSession } from "@/lib/session";
import { addMovement } from "@/lib/movements";
import { updateTag } from "next/cache";

vi.mock("@/lib/session", () => ({ getSession: vi.fn() }));
vi.mock("@/lib/api", () => ({ apiGet: vi.fn(), apiPost: vi.fn() }));
vi.mock("@/lib/users", () => ({ getUser: vi.fn() }));
vi.mock("@/lib/movements", () => ({
  addMovement: vi.fn(),
  getCreatedMovements: vi.fn(() => []),
}));
vi.mock("next/cache", () => ({
  updateTag: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));

const mockGetSession = vi.mocked(getSession);
const mockGetUser = vi.mocked(getUser);
const mockApiPost = vi.mocked(apiPost);
const mockAddMovement = vi.mocked(addMovement);
const mockUpdateTag = vi.mocked(updateTag);

function makeFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  formData.set("Cantidad", "50");
  formData.set("Motivo", "Pago test");
  formData.set("Contacto", "hector");
  for (const [key, value] of Object.entries(overrides)) {
    if (value === "") {
      formData.delete(key);
    } else {
      formData.set(key, value);
    }
  }
  return formData;
}

describe("sendTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue("1");
    mockGetUser.mockResolvedValue({
      id: 1,
      name: "Oscar",
      email: "oscar@gmail.com",
      balance: 100,
    });
  });

  it("redirects to /login when there is no session", async () => {
    mockGetSession.mockResolvedValue(null);
    await expect(sendTransaction(undefined, makeFormData())).rejects.toThrow(
      "NEXT_REDIRECT:/login",
    );
    expect(mockApiPost).not.toHaveBeenCalled();
  });

  it.each([
    ["0", "zero amount"],
    ["-10", "negative amount"],
    ["abc", "non-numeric amount"],
    ["", "missing amount"],
  ])("rejects %s (%s)", async (cantidad) => {
    const result = await sendTransaction(
      undefined,
      makeFormData({ Cantidad: cantidad }),
    );
    expect(result).toEqual({ error: "La cantidad debe ser mayor a 0" });
    expect(mockApiPost).not.toHaveBeenCalled();
  });

  it("rejects an empty motivo", async () => {
    const result = await sendTransaction(
      undefined,
      makeFormData({ Motivo: "   " }),
    );
    expect(result).toEqual({ error: "El motivo es requerido" });
  });

  it("rejects a missing contacto (destinatario obligatorio)", async () => {
    const result = await sendTransaction(
      undefined,
      makeFormData({ Contacto: "" }),
    );
    expect(result).toEqual({ error: "El contacto es requerido" });
    expect(mockApiPost).not.toHaveBeenCalled();
  });

  it("rejects when amount exceeds balance (saldo suficiente)", async () => {
    const result = await sendTransaction(
      undefined,
      makeFormData({ Cantidad: "150" }),
    );
    expect(result).toEqual({
      error: "Fondos insuficientes, te faltan 50 pesos",
    });
    expect(mockApiPost).not.toHaveBeenCalled();
  });

  it("records a completed movement and redirects on success", async () => {
    mockApiPost.mockResolvedValue(
      new Response("{}", { status: 201 }),
    );
    await expect(sendTransaction(undefined, makeFormData())).rejects.toThrow(
      /NEXT_REDIRECT:\/transactions\/confirmation\/201\//,
    );
    expect(mockAddMovement).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({ amount: 50, status: "completed" }),
    );
    expect(mockUpdateTag).toHaveBeenCalledWith("user");
  });

  it("records a failed movement and redirects to the error receipt", async () => {
    mockApiPost.mockResolvedValue(
      new Response("{}", { status: 408 }),
    );
    await expect(sendTransaction(undefined, makeFormData())).rejects.toThrow(
      /NEXT_REDIRECT:\/transactions\/confirmation\/408\//,
    );
    expect(mockAddMovement).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({ status: "failed" }),
    );
  });

  it("redirects to the unknown-error receipt when the network fails", async () => {
    mockApiPost.mockRejectedValue(new Error("socket hangup"));
    await expect(sendTransaction(undefined, makeFormData())).rejects.toThrow(
      /NEXT_REDIRECT:\/transactions\/confirmation\/520\//,
    );
    expect(mockAddMovement).not.toHaveBeenCalled();
  });

  it("carries cantidad, motivo and contacto in the confirmation URL", async () => {
    mockApiPost.mockResolvedValue(new Response("{}", { status: 201 }));
    await expect(sendTransaction(undefined, makeFormData())).rejects.toThrow(
      /cantidad=50&motivo=Pago\+test&contacto=hector/,
    );
  });
});
