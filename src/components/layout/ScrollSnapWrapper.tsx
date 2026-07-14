"use client";

import { useScrollSnap } from "@/hooks/useScrollSnap";

export function ScrollSnapWrapper({ children }: { children: React.ReactNode }) {
  useScrollSnap();
  return <>{children}</>;
}
