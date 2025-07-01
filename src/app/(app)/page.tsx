"use client";

import { Suspense } from "react";
import HomeInner from "../../components/home-screen";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeInner />
    </Suspense>
  );
} 