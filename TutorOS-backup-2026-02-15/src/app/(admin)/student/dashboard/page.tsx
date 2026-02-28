"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStudentAssignments } from "@/lib/firebase/assignments";
import { getQuizById } from "@/lib/firebase/quizzes";
import { QuizAssignment, AssignmentStatus } from "@/types/user";
import { Quiz } from "@/types/quiz";
import Link from "next/link";
import {
  Target,
  Clock,
  ChevronRight,
  Loader,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<
    (QuizAssignment & { quiz?: Quiz })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssignments = async () => {
      if (!user) return;
      try {
        const data = await getStudentAssignments(user.uid);

        // Fetch quiz details for each assignment
        const detailedAssignments = await Promise.all(
          data.map(async (a) => {
            const quiz = await getQuizById(a.quizId);
            return { ...a, quiz: quiz || undefined };
          }),
        );

        setAssignments(detailedAssignments);
      } catch (error) {
        console.error("Failed to load assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, [user]);

  const activeAssignments = assignments.filter(
    (a) => a.status !== AssignmentStatus.COMPLETED,
  );
  const completedAssignments = assignments.filter(
    (a) => a.status === AssignmentStatus.COMPLETED,
  );

  return (
    <div className="max-w-6xl mx-auto animate-in">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-gradient mb-3">
          Hey {user?.displayName?.split(" ")[0] || "Student"}! 👋
        </h1>
        <p className="text-lg text-white/40">
          Ready to tackle some math today? You have {activeAssignments.length}{" "}
          active assignments.
        </p>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main: Active Quizzes */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white/90 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm">
              🎯
            </span>
            Active Assignments
          </h2>

          {loading ? (
            <div className="p-12 glass rounded-2xl flex items-center justify-center text-white/20">
              <Loader className="animate-spin mr-2" /> Loading...
            </div>
          ) : activeAssignments.length === 0 ? (
            <div className="p-12 glass rounded-2xl text-center border border-white/5">
              <p className="text-white/40 italic">
                No assigned quizzes found. Enjoy your break!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {activeAssignments.map((a) => (
                <Link
                  key={a.id}
                  href={`/student/player/${a.id}`}
                  className="card group hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-6 items-center">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                          a.status === AssignmentStatus.IN_PROGRESS
                            ? "bg-secondary/20 text-secondary"
                            : "bg-white/5 text-white/20"
                        }`}
                      >
                        {a.status === AssignmentStatus.IN_PROGRESS ? (
                          <PlayCircle />
                        ) : (
                          <Target />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                          {a.quiz?.title || "Untitled Quiz"}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs font-mono text-white/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" />{" "}
                            {a.dueDate
                              ? new Date(a.dueDate).toLocaleDateString()
                              : "No deadline"}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                            {a.quiz?.questions.length || 0} Questions
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Completed & Progress */}
        <div className="space-y-8">
          {/* Progress Card */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-6">
              Your Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Completion Rate</span>
                  <span className="text-primary font-bold">
                    {assignments.length > 0
                      ? Math.round(
                          (completedAssignments.length / assignments.length) *
                            100,
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-1000"
                    style={{
                      width: `${assignments.length > 0 ? (completedAssignments.length / assignments.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recently Completed */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-4 ml-2">
              Recent Victories
            </h3>
            <div className="space-y-3">
              {completedAssignments.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium text-white/60 truncate max-w-[120px]">
                      {a.quiz?.title}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white/40">Done</span>
                </div>
              ))}
              {completedAssignments.length === 0 && (
                <p className="text-xs text-white/20 italic ml-2">
                  No completed quizzes yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
