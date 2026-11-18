import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn, userEvent, within, expect, waitFor } from "storybook/test";
import Login from "./page";
import { flow } from "@/.storybook/mocks/flow";

const meta = {
  title: "Screens/Login",
  component: Login,
  parameters: { layout: "fullscreen" },
  beforeEach: () => {
    flow.loginDelay = 400;
    flow.loginError = null;
    flow.onLoginSuccess = undefined;
  },
} satisfies Meta<typeof Login>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ValidationError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByTestId("login-user-input"),
      "not-an-email",
    );
    await userEvent.type(
      canvas.getByTestId("login-password-input"),
      "12345678",
    );
    await userEvent.click(canvas.getByTestId("login-submit-button"));
    await expect(
      await canvas.findByTestId("error-alert"),
    ).toHaveTextContent("Formato invalido para correo/telefono");
  },
};

export const PasswordError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByTestId("login-user-input"),
      "oscar@spin.com",
    );
    await userEvent.type(canvas.getByTestId("login-password-input"), "123");
    await userEvent.click(canvas.getByTestId("login-submit-button"));
    await expect(await canvas.findByTestId("error-alert")).toHaveTextContent(
      "La contraseña debe tener al menos 8 caracteres",
    );
  },
};

export const Loading: Story = {
  beforeEach: () => {
    flow.loginDelay = 60_000;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByTestId("login-user-input"),
      "oscar@spin.com",
    );
    await userEvent.type(
      canvas.getByTestId("login-password-input"),
      "12345678",
    );
    await userEvent.click(canvas.getByTestId("login-submit-button"));
    await expect(canvas.getByTestId("login-submit-button")).toBeDisabled();
    await expect(canvas.getByTestId("login-submit-button")).toHaveTextContent(
      "Cargando…",
    );
    flow.loginDelay = 400;
  },
};

export const Success: Story = {
  beforeEach: () => {
    flow.onLoginSuccess = fn();
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByTestId("login-user-input"),
      "oscar@spin.com",
    );
    await userEvent.type(
      canvas.getByTestId("login-password-input"),
      "12345678",
    );
    await userEvent.click(canvas.getByTestId("login-submit-button"));
    await waitFor(() =>
      expect(flow.onLoginSuccess).toHaveBeenCalled(),
    );
  },
};
