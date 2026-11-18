export type AlertType = "success" | "error" | "warning" | "info";

export const errors = {
  "500": "Error de red",
  "400": "Fondos insuficientes",
  "408": "Timeout de red",
  "520": "Error desconocido",
} as const;

export interface AlertProps {
  type: AlertType;
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}
