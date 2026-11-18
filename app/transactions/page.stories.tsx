import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn, userEvent, within, expect, waitFor } from "storybook/test";
import Transactions from "./page";
import { flow } from "@/.storybook/mocks/flow";

const meta = {
  title: "Screens/Nueva Transacción",
  component: Transactions,
  parameters: { layout: "fullscreen" },
  beforeEach: () => {
    flow.transactionDelay = 300;
    flow.transactionError = null;
    flow.transactionStatus = "201";
    flow.onTransaction = undefined;
  },
} satisfies Meta<typeof Transactions>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole("option", { name: "hector" }),
    ).toBeInTheDocument();
  },
};

export const NativeValidationBlocksEmptySubmit: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("transaction-submit-button"));
    await expect(
      canvas.queryByTestId("confirm-transaction-modal"),
    ).not.toBeInTheDocument();
  },
};

export const ConfirmFlow: Story = {
  beforeEach: () => {
    flow.onTransaction = fn();
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("option", { name: "hector" });
    await userEvent.type(
      canvas.getByTestId("transaction-amount-input"),
      "25",
    );
    await userEvent.type(
      canvas.getByTestId("transaction-reason-input"),
      "Pago GTA6",
    );
    await userEvent.selectOptions(canvas.getByTestId("contact-select"), "1");
    await userEvent.click(canvas.getByTestId("transaction-submit-button"));

    const modal = await canvas.findByTestId("confirm-transaction-modal");
    await expect(modal).toHaveTextContent("Cantidad: 25");
    await userEvent.click(canvas.getByTestId("confirm-transaction-button"));

    await waitFor(() =>
      expect(flow.onTransaction).toHaveBeenCalledWith("201", {
        cantidad: "25",
        motivo: "Pago GTA6",
        contacto: "hector",
      }),
    );
  },
};

export const SubmissionError: Story = {
  beforeEach: () => {
    flow.transactionError = "Fondos insuficientes, te faltan 50 pesos";
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("option", { name: "hector" });
    await userEvent.type(
      canvas.getByTestId("transaction-amount-input"),
      "150",
    );
    await userEvent.type(
      canvas.getByTestId("transaction-reason-input"),
      "Pago caro",
    );
    await userEvent.selectOptions(canvas.getByTestId("contact-select"), "1");
    await userEvent.click(canvas.getByTestId("transaction-submit-button"));
    await userEvent.click(
      await canvas.findByTestId("confirm-transaction-button"),
    );

    await expect(await canvas.findByTestId("error-alert")).toHaveTextContent(
      "Fondos insuficientes",
    );
    await expect(
      canvas.queryByTestId("confirm-transaction-modal"),
    ).not.toBeInTheDocument();
  },
};

export const NewContactFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("option", { name: "hector" });
    await userEvent.selectOptions(canvas.getByTestId("contact-select"), "new");

    const modal = await canvas.findByTestId("contact-modal");
    await userEvent.type(
      within(modal).getByTestId("contact-name-input"),
      "Pepe",
    );
    await userEvent.type(
      within(modal).getByTestId("contact-account-input"),
      "999888777",
    );
    await userEvent.click(within(modal).getByTestId("contact-save-button"));

    await expect(
      canvas.queryByTestId("contact-modal"),
    ).not.toBeInTheDocument();
    const select = canvas.getByTestId("contact-select") as HTMLSelectElement;
    await expect(select.selectedOptions[0].textContent).toBe("Pepe");
  },
};
