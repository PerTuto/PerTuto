"use client";

import React from "react";
import { useRouter } from "next/navigation";
import QuestionForm from "@/components/questions/QuestionForm";
import { createQuestion } from "@/lib/firebase/questions";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

import { Question } from "@/types/question";

export default function NewQuestionPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleCreate = async (data: Partial<Question>) => {
    setLoading(true);
    try {
      await createQuestion(
        data as Omit<Question, "id" | "createdAt" | "updatedAt">,
      );
      toast.success("Question created successfully!");
      router.push("/dashboard/questions");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Link
          href="/dashboard/questions"
          className="p-2 rounded-lg hover:bg-white/5 text-white/50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-black text-white">New Question</h1>
      </div>

      <QuestionForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
}
