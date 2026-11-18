"use client";

import { ButtonHTMLAttributes } from "react";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  message: string;
  testId?: string;
}

export function CustomButton({
  message,
  className,
  onClick,
  testId,
  ...props
}: CustomButtonProps) {
  return (
    <button
      {...props}
      className={`bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold py-2.5 px-5 rounded-full shadow-md transition-all hover:shadow-lg cursor-pointer ${className ?? ""}`}
      onClick={onClick}
      data-testid={testId}
    >
      {message}
    </button>
  );
}
