"use client";

import { Title } from "@/components/general/title";
import { CustomButton } from "@/components/general/button";

export default function HomeError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div
      data-testid="home-error"
      className="flex flex-1 flex-col items-center justify-center gap-4"
    >
      <Title size="sm">No pudimos cargar tu información</Title>
      <CustomButton
        testId="home-error-retry"
        message="Reintentar"
        onClick={() => reset()}
      />
    </div>
  );
}
