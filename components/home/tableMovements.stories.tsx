import type { Meta, StoryObj } from "@storybook/nextjs";
import { within, expect } from "storybook/test";
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
    description: "Envio a Fernanda",
    amount: 250,
    date: "2026-02-02",
    extra: "Pago Hollow Knight",
    status: "failed",
  },
];

const meta = {
  title: "Components/TableMovements",
  component: TableMovements,
  args: { movements },
} satisfies Meta<typeof TableMovements>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByTestId("movement-row")).toHaveLength(2);
  },
};

export const Empty: Story = {
  args: { movements: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("movements-empty")).toHaveTextContent(
      "No hay movimientos",
    );
  },
};

export const FailedMovement: Story = {
  args: { movements: [movements[1]] },
};
