"use client";

import { LeaderboardEntry } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardWidgetProps {
  entries: LeaderboardEntry[];
  className?: string;
}

export function LeaderboardWidget({ entries, className }: LeaderboardWidgetProps) {
  return (
    <Card className={`${className} bg-card/50 backdrop-blur-sm`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry, index) => {
          const isTopThree = index < 3;
          const RankIcon = index === 0 ? Trophy : Medal;
          const rankColor = index === 0 ? "text-yellow-500" : index === 1 ? "text-slate-300" : index === 2 ? "text-amber-600" : "text-muted-foreground";

          return (
            <div key={entry.studentId} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className={`w-6 text-xs font-bold ${rankColor}`}>
                  {isTopThree ? <RankIcon className="h-4 w-4" /> : entry.rank}
                </div>
                <Avatar className="h-8 w-8 border border-border group-hover:border-teal-500/50 transition-colors">
                  <AvatarImage src={entry.avatar} />
                  <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium leading-none">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-teal-600 dark:text-teal-400">
                  {entry.xp.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">XP</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
