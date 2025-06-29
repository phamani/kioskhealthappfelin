// app/home/page.tsx
"use client";

import { Suspense } from "react";
import PlaygroundInner from "../../../components/health-summary-screen"; // Rename your current logic to `home-inner.tsx`

export default function HealthSummary() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlaygroundInner />
    </Suspense>
  );
}
