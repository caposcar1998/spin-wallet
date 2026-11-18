import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn, userEvent, within, expect } from "storybook/test";
import { CustomInput } from "./input";

const meta = {
  title: "Components/CustomInput",
  component: CustomInput,
  args: { type: "text", name: "Motivo", testId: "story-input", onChange: fn() },
} satisfies Meta<typeof CustomInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const Typing: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId("story-input");
    await userEvent.type(input, "Pago GTA6");
    await expect(input).toHaveValue("Pago GTA6");
    await expect(args.onChange).toHaveBeenCalled();
  },
};
