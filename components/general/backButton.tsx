"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import backIcon from "@/public/back.png";

export function BackButton() {
  const router = useRouter();

  return (
    <button data-testid="back-button" className="self-start m-3 rounded-full p-2 transition-colors hover:bg-surface-strong cursor-pointer" onClick={() => router.back()}>
      <Image src={backIcon} alt="Back" width={24} height={24} />
    </button>
  );
}
