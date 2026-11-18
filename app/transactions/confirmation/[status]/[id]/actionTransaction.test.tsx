import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActionTransaction } from "./actionTransaction";
import { sendTransaction } from "@/app/transactions/actions";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/app/transactions/actions", () => ({
  sendTransaction: vi.fn(),
}));

const baseProps = {
  cantidad: "50",
  motivo: "Pago GTA6",
  contacto: "hector",
};

describe("ActionTransaction", () => {
  it("shows the retry button only on timeout (408)", () => {
    render(<ActionTransaction {...baseProps} status="408" />);
    expect(screen.getByTestId("retry-button")).toBeInTheDocument();
  });

  it.each(["201", "400", "500", "520"])(
    "hides retry on status %s",
    (status) => {
      render(<ActionTransaction {...baseProps} status={status} />);
      expect(screen.queryByTestId("retry-button")).not.toBeInTheDocument();
    },
  );

  it("always offers navigation back to transactions", () => {
    render(<ActionTransaction {...baseProps} status="400" />);
    expect(
      screen.getByTestId("back-to-transactions-button"),
    ).toBeInTheDocument();
  });

  it("navigates back on Regresar", async () => {
    render(<ActionTransaction {...baseProps} status="400" />);
    await userEvent.click(screen.getByTestId("back-to-transactions-button"));
    expect(push).toHaveBeenCalledWith("/transactions");
  });

  it("retries with the same transaction values", async () => {
    vi.mocked(sendTransaction).mockResolvedValue(undefined as never);
    render(<ActionTransaction {...baseProps} status="408" />);

    await userEvent.click(screen.getByTestId("retry-button"));

    expect(sendTransaction).toHaveBeenCalled();
    const formData = vi.mocked(sendTransaction).mock.calls[0][1] as FormData;
    expect(formData.get("Cantidad")).toBe("50");
    expect(formData.get("Motivo")).toBe("Pago GTA6");
    expect(formData.get("Contacto")).toBe("hector");
  });

  it("shows the action error when retry validation fails", async () => {
    vi.mocked(sendTransaction).mockResolvedValue({ error: "Fallo de prueba" });
    render(<ActionTransaction {...baseProps} status="408" />);

    await userEvent.click(screen.getByTestId("retry-button"));

    expect(await screen.findByTestId("retry-error-message")).toHaveTextContent(
      "Fallo de prueba",
    );
  });
});
