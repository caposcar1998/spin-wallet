import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TableMovements, {
  MAX_VISIBLE_ROWS,
  SCROLL_MAX_HEIGHT,
} from "./tableMovements";
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

function makeMovements(count: number): Movement[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    description: `Envio ${i + 1}`,
    amount: 10 + i,
    date: "2026-02-01",
    extra: `Pago ${i + 1}`,
    status: "completed",
  }));
}

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

  it("caps the scroll area at the visible-rows limit", () => {
    expect(SCROLL_MAX_HEIGHT).toBe(`${MAX_VISIBLE_ROWS * 53}px`);
    render(<TableMovements movements={movements} />);
    expect(screen.getByTestId("movements-table-scroll")).toHaveStyle({
      maxHeight: SCROLL_MAX_HEIGHT,
    });
    expect(screen.getByTestId("movements-list")).toHaveStyle({
      maxHeight: SCROLL_MAX_HEIGHT,
    });
  });

  it("keeps every movement in the DOM — the limit is visual, the rest scrolls", () => {
    render(<TableMovements movements={makeMovements(12)} />);
    expect(screen.getAllByTestId("movement-row")).toHaveLength(12);
    expect(screen.getAllByTestId("movement-item")).toHaveLength(12);
  });

  it("filters movements by description as you type", async () => {
    const user = userEvent.setup();
    render(<TableMovements movements={movements} />);
    await user.type(screen.getByTestId("movements-search-input"), "oscar");
    expect(screen.getAllByTestId("movement-row")).toHaveLength(1);
    expect(screen.getAllByTestId("movement-item")).toHaveLength(1);
  });

  it("filters by motivo (extra field)", async () => {
    const user = userEvent.setup();
    render(<TableMovements movements={movements} />);
    await user.type(screen.getByTestId("movements-search-input"), "zelda");
    expect(screen.getAllByTestId("movement-row")).toHaveLength(1);
  });

  it("shows the no-results state for an unmatched query", async () => {
    const user = userEvent.setup();
    render(<TableMovements movements={movements} />);
    await user.type(screen.getByTestId("movements-search-input"), "nope");
    expect(screen.getByTestId("movements-search-empty")).toHaveTextContent(
      "Sin resultados",
    );
    expect(screen.queryAllByTestId("movement-row")).toHaveLength(0);
    expect(screen.queryAllByTestId("movement-item")).toHaveLength(0);
  });

  it("resets to every movement when the search is cleared", async () => {
    const user = userEvent.setup();
    render(<TableMovements movements={movements} />);
    const input = screen.getByTestId("movements-search-input");
    await user.type(input, "oscar");
    await user.clear(input);
    expect(screen.getAllByTestId("movement-row")).toHaveLength(2);
  });
});
