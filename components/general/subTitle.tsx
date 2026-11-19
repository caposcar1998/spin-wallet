import { ReactNode } from "react";

const sizes = {
  sm: "text-xl",
  lg: "text-2xl",
} as const;

interface SubTitleProps {
  children: ReactNode;
  size?: keyof typeof sizes;
  className?: string;
  testId?: string;
}

export function SubTitle({ children, size = "lg", className, testId }: SubTitleProps) {
  return (
    <h2 data-testid={testId} className={`${sizes[size]} font-semibold ${className ?? ""}`}>{children}</h2>
  );
}
