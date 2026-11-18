import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalContact } from "./modalContact";

describe("ModalContact", () => {
  it("renders nothing when closed", () => {
    render(<ModalContact isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.queryByTestId("contact-modal")).not.toBeInTheDocument();
  });

  it("saves the contact and closes on submit", async () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(<ModalContact isOpen={true} onClose={onClose} onSave={onSave} />);

    await userEvent.type(
      screen.getByTestId("contact-name-input"),
      "Pepe",
    );
    await userEvent.type(
      screen.getByTestId("contact-account-input"),
      "1234567890",
    );
    await userEvent.click(screen.getByTestId("contact-save-button"));

    expect(onSave).toHaveBeenCalledWith("Pepe", "1234567890");
    expect(onClose).toHaveBeenCalled();
  });

  it("closes without saving via the close button", async () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(<ModalContact isOpen={true} onClose={onClose} onSave={onSave} />);

    await userEvent.click(screen.getByTestId("close-button"));

    expect(onClose).toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
  });
});
