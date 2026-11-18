import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalConfirmTransaction } from "./modalConfirmTransaction";

const baseProps = {
  isOpen: true,
  onClose: vi.fn(),
  formAction: vi.fn(),
  isPending: false,
  quantity: 50,
  reason: "Pago GTA6",
  contact: "hector",
};

describe("ModalConfirmTransaction", () => {
  it("renders nothing when closed", () => {
    render(<ModalConfirmTransaction {...baseProps} isOpen={false} />);
    expect(
      screen.queryByTestId("confirm-transaction-modal"),
    ).not.toBeInTheDocument();
  });

  it("shows the transaction summary", () => {
    render(<ModalConfirmTransaction {...baseProps} />);
    const modal = screen.getByTestId("confirm-transaction-modal");
    expect(modal).toHaveTextContent("Cantidad");
    expect(modal).toHaveTextContent("$50");
    expect(modal).toHaveTextContent("Razón");
    expect(modal).toHaveTextContent("Pago GTA6");
    expect(modal).toHaveTextContent("Contacto");
    expect(modal).toHaveTextContent("hector");
  });

  it("submits the hidden values through the form action", async () => {
    const formAction = vi.fn();
    render(<ModalConfirmTransaction {...baseProps} formAction={formAction} />);

    await userEvent.click(screen.getByTestId("confirm-transaction-button"));

    expect(formAction).toHaveBeenCalled();
    const formData = formAction.mock.calls[0][0] as FormData;
    expect(formData.get("Cantidad")).toBe("50");
    expect(formData.get("Motivo")).toBe("Pago GTA6");
    expect(formData.get("Contacto")).toBe("hector");
  });

  it("disables the button while pending", () => {
    render(<ModalConfirmTransaction {...baseProps} isPending={true} />);
    expect(screen.getByTestId("confirm-transaction-button")).toBeDisabled();
    expect(screen.getByTestId("confirm-transaction-button")).toHaveTextContent(
      "Enviando…",
    );
  });
});
