"use client";

import React, { useState } from "react";
import { Quiz } from "@/types/quiz";
import { Question, QuestionType } from "@/types/question";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Loader,
} from "lucide-react";
import { useRouter } from "next/navigation";
import MathText from "@/components/ui/MathText";

interface QuizPlayerProps {
  quiz: Quiz;
  questions: Question[];
  onComplete: (answers: Record<string, string | number | boolean>) => void;
  isSubmitting?: boolean;
}

export default function QuizPlayer({
  quiz,
  questions,
  onComplete,
  isSubmitting,
}: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<string, string | number | boolean>
  >({});
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const router = useRouter();

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelectOption = (optionText: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionText });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowConfirmSubmit(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isAnswered = (id: string) => answers[id] !== undefined;

  // Render text with LaTeX support
  const renderContent = (text: string) => {
    return (
      <div className="prose prose-invert max-w-none">
        <MathText
          as="div"
          className="text-xl leading-relaxed font-serif text-white/90"
        >
          {text}
        </MathText>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      {/* Top Navigation / Progress */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
          >
            <ChevronLeft />
          </button>
          <div>
            <h1 className="font-bold text-sm tracking-tight">{quiz.title}</h1>
            <p className="text-[10px] uppercase font-black tracking-widest text-white/20">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-white/60">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-mono font-bold tracking-tighter">
              {/* Optional Timer Logic Here */}
              Untimed
            </span>
          </div>
          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="btn btn-primary py-2 text-xs"
          >
            Finish Quiz
          </button>
        </div>
      </header>

      {/* Main Player Area */}
      <main className="flex-1 container max-w-4xl mx-auto py-12 px-6">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Question Content */}
          <div className="mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6 border border-primary/20">
              {currentQuestion.type.replace(/_/g, " ")}
            </span>
            {renderContent(currentQuestion.content)}
          </div>

          {/* Question Images */}
          {currentQuestion.images && currentQuestion.images.length > 0 && (
            <div className="flex gap-4 mb-12 overflow-x-auto p-4 glass rounded-2xl border border-white/5">
              {currentQuestion.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="Question diagram"
                  className="h-64 rounded-xl border border-white/10 shadow-2xl no-print"
                />
              ))}
            </div>
          )}

          {/* Interaction Area */}
          <div className="space-y-4">
            {(currentQuestion.type === QuestionType.MCQ_SINGLE ||
              currentQuestion.type === QuestionType.MCQ_MULTI ||
              currentQuestion.type === QuestionType.TRUE_FALSE) &&
              currentQuestion.options && (
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((option, i) => {
                    const isSelected =
                      answers[currentQuestion.id] === option.text;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelectOption(option.text)}
                        className={`p-6 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                          isSelected
                            ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
                            : "bg-white/3 border-white/5 hover:border-white/20 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                              isSelected
                                ? "bg-primary text-white"
                                : "bg-white/5 text-white/40 group-hover:text-white"
                            }`}
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                          <MathText
                            className={`font-medium ${isSelected ? "text-white" : "text-white/60"}`}
                          >
                            {option.text}
                          </MathText>
                        </div>
                        {isSelected && (
                          <CheckCircle className="text-primary w-5 h-5 animate-in zoom-in" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

            {currentQuestion.type === QuestionType.FREE_RESPONSE && (
              <div className="space-y-2">
                <label className="label">Your Answer</label>
                <input
                  type="text"
                  className="input-field py-5 text-xl font-medium"
                  placeholder="Type your answer here..."
                  value={(answers[currentQuestion.id] as string) || ""}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [currentQuestion.id]: e.target.value,
                    })
                  }
                />
                <p className="text-white/20 text-xs italic">
                  For math symbols, use clear notation or LaTeX if comfortable.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Control Bar */}
      <footer className="footer-bar glass border-t border-white/5 px-6 py-4 flex items-center justify-between sticky bottom-0 z-50">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="btn bg-white/5 hover:bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 mr-2" /> Previous
        </button>

        <div className="flex gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-primary w-6"
                  : isAnswered(questions[i].id)
                    ? "bg-secondary"
                    : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <button onClick={handleNext} className="btn btn-primary">
          {currentIndex === questions.length - 1 ? "Finish" : "Next"}{" "}
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </footer>

      {/* Confirm Submit Overlay */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-xl animate-in fade-in">
          <div className="card max-w-md w-full border-primary/20 shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)] p-10 text-center">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              🎉
            </div>
            <h2 className="text-2xl font-black mb-2">Ready to submit?</h2>
            <p className="text-white/40 mb-8">
              You&apos;ve answered {Object.keys(answers).length} out of{" "}
              {questions.length} questions. You cannot change your answers after
              submitting.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="btn bg-white/5 hover:bg-white/10 text-white"
              >
                Go Back
              </button>
              <button
                onClick={() => onComplete(answers)}
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? (
                  <Loader className="animate-spin w-5 h-5" />
                ) : (
                  "Submit Now"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
