import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn, userEvent, within, expect } from "storybook/test";
import { CustomButton } from "./button";

const meta = {
  title: "Components/CustomButton",
  component: CustomButton,
  args: { message: "Enviar", onClick: fn() },
} satisfies Meta<typeof CustomButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { message: "Cargando…", disabled: true },
};

export const Click: Story = {
  args: { testId: "story-button" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("story-button"));
    await expect(args.onClick).toHaveBeenCalled();
  },
};
