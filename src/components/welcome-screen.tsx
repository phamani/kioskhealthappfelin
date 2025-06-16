"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-12 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <h1 className="text-5xl font-bold text-blue-700">
          Welcome to Health Check
        </h1>
        <p className="text-2xl text-gray-600 max-w-3xl">
          Get a quick assessment of your health with our advanced kiosk system.
          Touch the screen to begin your health check journey.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="flex flex-col items-center space-y-8"
      >
        <img
          src="/carevision.jpg"
          alt="Health Check Logo"
          className="w-48 h-48"
        />

        <Button
          onClick={onNext}
          className="text-2xl py-8 px-16 rounded-full bg-blue-600 hover:bg-blue-700 transition-all"
        >
          Start Health Check
        </Button>
      </motion.div>
    </div>
  );
}
