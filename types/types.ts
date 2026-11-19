import type { ReactNode } from "react";

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertProps {
  type: AlertType;
  isOpen?: boolean;
  onClose?: () => void;
  children?: ReactNode;
}

export interface Movement {
  id: number;
  description: string;
  amount: number;
  date: string;
  extra: string;
  status: "completed" | "failed";
  contact?: string;
  transactionId?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  balance: number;
}

export interface SavedContact {
  id: number;
  name: string;
  email: string;
}
