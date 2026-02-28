"use client";

import { Badge as BadgeType } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { 
  Trophy, 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  Star, 
  Clock, 
  Award,
  Zap
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ICON_MAP: Record<string, any> = {
  trophy: Trophy,
  flame: Flame,
  book: BookOpen,
  check: CheckCircle2,
  star: Star,
  clock: Clock,
  award: Award,
  zap: Zap,
};

interface BadgeShowcaseProps {
  badges: BadgeType[];
  className?: string;
}

export function BadgeShowcase({ badges, className }: BadgeShowcaseProps) {
  return (
    <TooltipProvider>
      <div className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 ${className}`}>
        {badges.map((badge) => {
          const IconComponent = ICON_MAP[badge.icon.toLowerCase()] || Trophy;
          
          return (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <div className="group relative flex flex-col items-center justify-center">
                  <div className="relative p-3 rounded-2xl bg-gradient-to-br from-teal-500/10 to-teal-500/20 border border-teal-500/20 group-hover:scale-110 transition-transform cursor-pointer">
                    <IconComponent className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    <div className="absolute inset-0 bg-teal-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="font-bold">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
        {badges.length === 0 && (
          <div className="col-span-full py-8 text-center text-muted-foreground text-sm border-2 border-dashed rounded-xl">
            No badges unlocked yet. Keep learning!
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
