
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  getGradeChallenges, 
  updateGradeChallenge,
  getEvaluation,
  getTest
} from "@/lib/firebase/services";
import { GradeChallenge, Evaluation, Test } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  MessageSquareQuote, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Search,
  ChevronRight,
  User,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default function GradeChallengesPage() {
  const { tenantId } = useParams() as { tenantId: string };
  const router = useRouter();
  const { toast } = useToast();
  
  const [challenges, setChallenges] = useState<GradeChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getGradeChallenges(tenantId);
      setChallenges(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load grade challenges", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tenantId]);

  const handleResolve = async (id: string, decision: 'resolved', marksChange: number) => {
    try {
      await updateGradeChallenge(tenantId, id, {
        status: decision,
        resolvedAt: new Date(),
        marksChange,
        resolvedBy: "Teacher ID"
      });
      toast({ title: "Challenge Resolved", description: "The grade has been updated." });
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Update failed", variant: "destructive" });
    }
  };

  const filteredChallenges = challenges.filter(c => 
    c.reason.toLowerCase().includes(search.toLowerCase()) || 
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-outfit text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <MessageSquareQuote className="w-8 h-8 text-secondary" /> Grade Challenges
          </h1>
          <p className="text-muted-foreground dark:text-white/40">Resolve student reports about AI grading discrepancies.</p>
        </div>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 dark:text-white/20 group-focus-within:text-secondary transition-colors" />
        <Input 
          placeholder="Filter challenges..." 
          className="ps-10 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 h-11 rounded-xl text-slate-900 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Clock className="w-8 h-8 animate-spin text-secondary" />
        </div>
      ) : filteredChallenges.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredChallenges.map((challenge) => (
            <Card key={challenge.id} className="bg-glass border-slate-200 dark:border-white/5 hover:border-secondary/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-[3] space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge className={
                                challenge.status === 'open' ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' :
                                challenge.status === 'reviewing' ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' :
                                'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                            }>
                                {challenge.status.toUpperCase()}
                            </Badge>
                            <span className="text-[10px] font-black text-muted-foreground/50 dark:text-white/20 uppercase tracking-widest">
                                Filed on {format(challenge.createdAt, 'MMM dd, hh:mm a')}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground dark:text-white/40 mb-1 flex items-center gap-2">
                                <User className="w-3.5 h-3.5" /> Student: {challenge.studentId}
                            </p>
                            <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/5">
                                <p className="text-sm text-slate-800 dark:text-white leading-relaxed">
                                    <MessageSquare className="w-4 h-4 text-secondary mb-2" />
                                    {challenge.reason}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between border-l border-slate-200 dark:border-white/5 ps-6 gap-6">
                        <div className="space-y-4">
                            <Button variant="ghost" className="w-full justify-between text-xs font-bold text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 px-3 rounded-lg" onClick={() => router.push(`/dashboard/${tenantId}/review-evaluations?id=${challenge.evaluationId}`)}>
                                View AI Evaluation <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                        </div>

                        {challenge.status === 'open' && (
                            <div className="flex gap-2">
                                <Button className="flex-1 bg-secondary hover:bg-secondary/90 text-white font-bold h-10 rounded-xl text-xs" onClick={() => handleResolve(challenge.id, 'resolved', 0)}>
                                    Resolve
                                </Button>
                                <Button variant="ghost" className="h-10 w-10 text-muted-foreground dark:text-white/20 hover:text-slate-900 dark:hover:text-white p-0">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                        {challenge.status === 'resolved' && (
                            <div className="flex items-center gap-2 text-green-500 font-bold text-[10px] uppercase">
                                <CheckCircle2 className="w-4 h-4" /> Resolved
                            </div>
                        )}
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-50 dark:bg-white/5 border-dashed border-slate-200 dark:border-white/10 p-24 text-center">
            <CardContent className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6 text-muted-foreground/50 dark:text-white/20">
                    <MessageSquareQuote className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No active challenges</h3>
                <p className="text-muted-foreground dark:text-white/40 max-w-sm mx-auto">Student reports will appear here if they dispute their AI-generated grades.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
