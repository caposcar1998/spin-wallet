import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn, userEvent, within, expect } from "storybook/test";
import { Alert } from "./alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  args: { isOpen: true, onClose: fn(), children: <p>Mensaje de prueba</p> },
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {
  args: { type: "error", children: <p>Fondos insuficientes</p> },
};

export const Success: Story = {
  args: { type: "success", children: <p>Transacción exitosa</p> },
};

export const Warning: Story = {
  args: { type: "warning", children: <p>Revisa los datos</p> },
};

export const Closes: Story = {
  args: { type: "error" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("close-button"));
    await expect(args.onClose).toHaveBeenCalled();
  },
};
