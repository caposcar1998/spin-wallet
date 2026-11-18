import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert } from "./alert";

describe("Alert", () => {
  it("renders nothing when closed", () => {
    render(
      <Alert type="error" isOpen={false}>
        <p>fallo</p>
      </Alert>,
    );
    expect(screen.queryByTestId("error-alert")).not.toBeInTheDocument();
  });

  it("shows the alert variant for its type", () => {
    render(
      <Alert type="error" isOpen={true}>
        <p>Fondos insuficientes</p>
      </Alert>,
    );
    expect(screen.getByTestId("error-alert")).toHaveTextContent(
      "Fondos insuficientes",
    );
  });

  it("calls onClose via the close button", async () => {
    const onClose = vi.fn();
    render(
      <Alert type="success" isOpen={true} onClose={onClose}>
        <p>ok</p>
      </Alert>,
    );
    await userEvent.click(screen.getByTestId("close-button"));
    expect(onClose).toHaveBeenCalled();
  });
});
