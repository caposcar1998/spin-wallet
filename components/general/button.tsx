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
      className={`bg-buttons hover:bg-hover disabled:opacity-50 text-white font-bold py-2 px-4 rounded-full ${className ?? ""}`}
      onClick={onClick}
      data-testid={testId}
    >
      {message}
    </button>
  );
}
