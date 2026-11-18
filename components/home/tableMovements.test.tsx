import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TableMovements from "./tableMovements";
import type { Movement } from "@/types/types";

const movements: Movement[] = [
  {
    id: 1,
    description: "Envio a oscar",
    amount: 100,
    date: "2026-02-01",
    extra: "Pago GTA6",
    status: "completed",
  },
  {
    id: 2,
    description: "Envio a Hector",
    amount: 150,
    date: "2026-02-02",
    extra: "Pago Zelda",
    status: "failed",
  },
];

describe("TableMovements", () => {
  it("shows the empty state when there are no movements", () => {
    render(<TableMovements movements={[]} />);
    expect(screen.getByTestId("movements-empty")).toHaveTextContent(
      "No hay movimientos",
    );
  });

  it("renders a row per movement in both layouts", () => {
    render(<TableMovements movements={movements} />);
    expect(screen.getAllByTestId("movement-row")).toHaveLength(2);
    expect(screen.getAllByTestId("movement-item")).toHaveLength(2);
  });

  it("shows the status icon for each movement", () => {
    render(<TableMovements movements={movements} />);
    expect(screen.getAllByText("✅").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("❌").length).toBeGreaterThanOrEqual(1);
  });

  it("links each movement to its detail page", () => {
    render(<TableMovements movements={movements} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/transactions/1");
    expect(links[1]).toHaveAttribute("href", "/transactions/2");
  });
});
