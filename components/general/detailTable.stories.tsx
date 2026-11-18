import type { Meta, StoryObj } from "@storybook/nextjs";
import { within, expect } from "storybook/test";
import { DetailTable } from "./detailTable";

const meta = {
  title: "Components/DetailTable",
  component: DetailTable,
  args: {
    className: "w-full max-w-md",
    rows: [
      { label: "Monto", value: "$50" },
      { label: "Fecha", value: "2026-02-02" },
      { label: "Descripción", value: "Pago GTA6" },
    ],
  },
} satisfies Meta<typeof DetailTable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Receipt: Story = {};

export const WithErrorRow: Story = {
  args: {
    rows: [
      { label: "Estado", value: "Timeout de red" },
      { label: "Monto", value: "$50" },
      { label: "ID", value: "123456" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("detail-table")).toHaveTextContent(
      "Timeout de red",
    );
  },
};
