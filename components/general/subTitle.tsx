import { ReactNode } from "react";

const sizes = {
  sm: "text-xl",
  lg: "text-2xl",
} as const;

interface SubTitleProps {
  children: ReactNode;
  size?: keyof typeof sizes;
  className?: string;
}

export function SubTitle({ children, size = "lg", className }: SubTitleProps) {
  return (
    <h2 className={`${sizes[size]} font-semibold ${className ?? ""}`}>{children}</h2>
  );
}
