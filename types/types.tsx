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

export interface Movement {
  id: number;
  description: string;
  amount: number;
  date: string;
  extra: string;
  status: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
  movements: Movement[];
}

export interface SavedContact {
  id: number;
  name: string;
  email: string;
}
