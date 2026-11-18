import { ReactNode } from "react";

const sizes = {
  sm: "text-xs",
  lg: "text-lg",
} as const;

interface GeneralTextProps {
  children: ReactNode;
  size?: keyof typeof sizes;
  className?: string;
}

export function GeneralText({ children, size = "lg", className }: GeneralTextProps) {
  return (
    <p className={`${sizes[size]} ${className ?? ""}`}>{children}</p>
  );
}
