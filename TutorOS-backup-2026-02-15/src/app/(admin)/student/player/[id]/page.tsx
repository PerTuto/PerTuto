"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getQuizById } from "@/lib/firebase/quizzes";
import { getQuestionById } from "@/lib/firebase/questions";
import {
  submitQuizAttempt,
  startQuizAttempt,
} from "@/lib/firebase/assignments";
import { Quiz } from "@/types/quiz";
import { Question } from "@/types/question";
import QuizPlayer from "@/components/player/QuizPlayer";
import { Loader } from "lucide-react";

export default function StudentPlayerPage() {
  const { id } = useParams(); // Assignment ID
  const router = useRouter();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadQuizData = async () => {
      if (!id || !user) return;
      try {
        // In a real app, you'd fetch the assignment first to get the quizId
        // but for now we'll assume the URL param id can lead us to the right place
        // Actually, we need the assignment data to get quizId.
        // Let's assume the param ID is the assignment ID.

        // Mocking assignment fetch for now or adding a service helper
        // Let's use a simplify approach: if we have the assignment, we have the quiz.
        // For this MVP, I'll fetch the assignment from firestore.
        const { doc, getDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase/config");

        const assignmentRef = doc(db, "assignments", id as string);
        const assignmentSnap = await getDoc(assignmentRef);

        if (!assignmentSnap.exists()) {
          alert("Assignment not found");
          router.push("/student/dashboard");
          return;
        }

        const assignment = assignmentSnap.data();
        const qData = await getQuizById(assignment.quizId);

        if (!qData) {
          alert("Quiz data missing");
          router.push("/student/dashboard");
          return;
        }

        setQuiz(qData);

        // Fetch questions
        const fetchedQuestions = await Promise.all(
          qData.questions.map((qConfig) => getQuestionById(qConfig.questionId)),
        );
        setQuestions(fetchedQuestions.filter((q) => q !== null) as Question[]);

        // Mark as started
        await startQuizAttempt(id as string, assignment.quizId, user.uid);
      } catch (error) {
        console.error("Error loading player:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [id, user, router]);

  const handleComplete = async (
    answers: Record<string, string | number | boolean>,
  ) => {
    if (!quiz || !user || !id) return;
    setSubmitting(true);
    try {
      // Auto-grading logic
      let score = 0;
      questions.forEach((q) => {
        const studentAnswer = answers[q.id];
        if (studentAnswer === q.correctAnswer) {
          const config = quiz.questions.find((c) => c.questionId === q.id);
          score += config?.points || 0;
        }
      });

      // Submit
      // We need the attemptId created in useEffect.
      // Let's store it in state instead.
      // For now, I'll use a hack to get it or refactor startQuizAttempt.
      const assignmentRef = (await import("firebase/firestore")).doc(
        (await import("@/lib/firebase/config")).db,
        "assignments",
        id as string,
      );
      const assignmentSnap = await (
        await import("firebase/firestore")
      ).getDoc(assignmentRef);
      const attemptId = assignmentSnap.data()?.attemptId;

      await submitQuizAttempt(
        attemptId,
        id as string,
        answers,
        score,
        quiz.totalPoints,
      );

      router.push("/student/dashboard"); // Or a results page
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader className="w-10 h-10 text-primary animate-spin" />
        <p className="text-white/40 font-bold tracking-widest uppercase text-xs">
          Entering Exam Room...
        </p>
      </div>
    );

  if (!quiz) return null;

  return (
    <QuizPlayer
      quiz={quiz}
      questions={questions}
      onComplete={handleComplete}
      isSubmitting={submitting}
    />
  );
}
