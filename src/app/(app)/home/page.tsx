// app/home/page.tsx
"use client";

import { Suspense } from "react";
import HomeInner from "../../../components/home-screen"; // Rename your current logic to `home-inner.tsx`

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeInner />
    </Suspense>
  );
}
