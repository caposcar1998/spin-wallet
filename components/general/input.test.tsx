import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomInput } from "./input";

describe("CustomInput", () => {
  it("associates the label with the input", () => {
    render(<CustomInput type="text" name="Motivo" />);
    expect(screen.getByLabelText("Motivo")).toBeInTheDocument();
  });

  it("marks the input as required", () => {
    render(<CustomInput type="text" name="Motivo" required />);
    expect(screen.getByLabelText("Motivo")).toBeRequired();
  });

  it("propagates onChange", async () => {
    const onChange = vi.fn();
    render(
      <CustomInput type="text" name="Motivo" testId="motivo" onChange={onChange} />,
    );
    await userEvent.type(screen.getByTestId("motivo"), "a");
    expect(onChange).toHaveBeenCalled();
  });
});
