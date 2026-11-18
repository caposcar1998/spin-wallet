import { ReactNode } from "react";

const sizes = {
  sm: "text-2xl",
  lg: "text-4xl",
} as const;

interface TitleProps {
  children: ReactNode;
  size?: keyof typeof sizes;
  className?: string;
}

export function Title({ children, size = "lg", className }: TitleProps) {
  return (
    <h1 className={`${sizes[size]} font-bold ${className ?? ""}`}>{children}</h1>
  );
}
