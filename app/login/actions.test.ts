import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginUser } from "./actions";

const cookieSet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: async () => ({ set: cookieSet, get: vi.fn(), delete: vi.fn() }),
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));

function makeFormData(user: string, password: string) {
  const formData = new FormData();
  formData.set("user", user);
  formData.set("password", password);
  return formData;
}

describe("loginUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects an invalid email/phone format", async () => {
    const result = await loginUser(undefined, makeFormData("not-an-email", "12345678"));
    expect(result).toEqual({ error: "Formato invalido para correo/telefono" });
    expect(cookieSet).not.toHaveBeenCalled();
  });

  it("rejects a password shorter than 8 characters", async () => {
    const result = await loginUser(undefined, makeFormData("oscar@spin.com", "123"));
    expect(result).toEqual({ error: "La contraseña debe tener al menos 8 caracteres" });
    expect(cookieSet).not.toHaveBeenCalled();
  });

  it("accepts a valid email", async () => {
    vi.useFakeTimers();
    const assertion = expect(
      loginUser(undefined, makeFormData("oscar@spin.com", "12345678")),
    ).rejects.toThrow("NEXT_REDIRECT:/home");
    await vi.advanceTimersByTimeAsync(2000);
    await assertion;
    vi.useRealTimers();
    expect(cookieSet).toHaveBeenCalledWith("userId", "1", expect.objectContaining({ httpOnly: true }));
  });

  it("accepts a valid phone number", async () => {
    vi.useFakeTimers();
    const assertion = expect(
      loginUser(undefined, makeFormData("5512345678", "12345678")),
    ).rejects.toThrow("NEXT_REDIRECT:/home");
    await vi.advanceTimersByTimeAsync(2000);
    await assertion;
    vi.useRealTimers();
  });
});
