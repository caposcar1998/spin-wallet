export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertProps {
  type: AlertType;
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}
