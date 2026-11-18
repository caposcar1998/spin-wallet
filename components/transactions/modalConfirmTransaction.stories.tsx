import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn, userEvent, within, expect } from "storybook/test";
import { ModalConfirmTransaction } from "./modalConfirmTransaction";

const meta = {
  title: "Components/ModalConfirmTransaction",
  component: ModalConfirmTransaction,
  args: {
    isOpen: true,
    onClose: fn(),
    formAction: fn(),
    isPending: false,
    quantity: 50,
    reason: "Pago GTA6",
    contact: "hector",
  },
} satisfies Meta<typeof ModalConfirmTransaction>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = {};

export const Pending: Story = {
  args: { isPending: true },
};

export const Confirm: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("confirm-transaction-button"));
    await expect(args.formAction).toHaveBeenCalled();
    const formData = args.formAction.mock.calls[0][0] as FormData;
    await expect(formData.get("Motivo")).toBe("Pago GTA6");
  },
};
