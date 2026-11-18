"use client";

import { ButtonHTMLAttributes } from "react";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  message: string;
}

export function CustomButton({
  message,
  className,
  ...props
}: CustomButtonProps) {
  return (
    <button
      {...props}
      className={`bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-full ${className ?? ""}`}
    >
      {message}
    </button>
  );
}
