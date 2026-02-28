"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

interface XpProgressProps {
  currentXp: number;
  level: number;
  className?: string;
}

export function XpProgress({ currentXp, level, className }: XpProgressProps) {
  // Formula: Level = sqrt(XP/100) + 1  => XP = (Level-1)^2 * 100
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 100;
  const xpForNextLevel = Math.pow(level, 2) * 100;
  const progressToNextLevel = ((currentXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 font-medium text-teal-600 dark:text-teal-400">
          <Zap className="h-4 w-4 fill-current" />
          <span>Level {level}</span>
        </div>
        <span className="text-muted-foreground">
          {Math.floor(currentXp - xpForCurrentLevel)} / {xpForNextLevel - xpForCurrentLevel} XP to Level {level + 1}
        </span>
      </div>
      <div className="relative pt-1">
        <Progress value={progressToNextLevel} className="h-2 bg-teal-100 dark:bg-teal-900/30" />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-1 -right-1"
        >
          <div className="h-4 w-4 rounded-full bg-teal-500 blur-sm animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}
