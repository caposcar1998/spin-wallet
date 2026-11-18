import { ReactNode } from "react";

const sizes = {
  sm: "text-2xl",
  lg: "text-4xl",
} as const;

interface TitleProps {
  children: ReactNode;
  size?: keyof typeof sizes;
  className?: string;
  testId?: string;
}

export function Title({ children, size = "lg", className, testId }: TitleProps) {
  return (
    <h1 data-testid={testId} className={`${sizes[size]} font-bold ${className ?? ""}`}>{children}</h1>
  );
}
