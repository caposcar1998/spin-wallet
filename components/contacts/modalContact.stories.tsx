import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn, userEvent, within, expect } from "storybook/test";
import { ModalContact } from "./modalContact";

const meta = {
  title: "Components/ModalContact",
  component: ModalContact,
  args: { isOpen: true, onClose: fn(), onSave: fn() },
} satisfies Meta<typeof ModalContact>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SaveContact: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId("contact-name-input"), "Pepe");
    await userEvent.type(canvas.getByTestId("contact-account-input"), "9876543210");
    await userEvent.click(canvas.getByTestId("contact-save-button"));
    await expect(args.onSave).toHaveBeenCalledWith("Pepe", "9876543210");
    await expect(args.onClose).toHaveBeenCalled();
  },
};
