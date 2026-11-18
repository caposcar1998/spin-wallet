import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DetailTable } from "./detailTable";

describe("DetailTable", () => {
  it("renders each label/value row", () => {
    render(
      <DetailTable
        rows={[
          { label: "Monto", value: "$50" },
          { label: "Motivo", value: "Pago GTA6" },
          { label: "Estado", value: "completed" },
        ]}
      />,
    );
    const table = screen.getByTestId("detail-table");
    expect(table).toHaveTextContent("Monto");
    expect(table).toHaveTextContent("$50");
    expect(table).toHaveTextContent("Motivo");
    expect(table).toHaveTextContent("Pago GTA6");
    expect(table).toHaveTextContent("Estado");
    expect(table).toHaveTextContent("completed");
  });

  it("renders only the rows it receives (conditional rows)", () => {
    render(<DetailTable rows={[{ label: "ID", value: "42" }]} />);
    expect(screen.getByTestId("detail-table")).not.toHaveTextContent("Estado");
  });
});
