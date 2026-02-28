"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Quiz } from "@/types/quiz";
import { Question, QuestionType } from "@/types/question";
import {
  getQuizBySlug,
  getPublicQuizQuestions,
  submitPublicAttempt,
} from "@/lib/firebase/publicQuiz";
import MathText from "@/components/ui/MathText";
import {
  Loader,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Lock,
  Trophy,
  RotateCcw,
} from "lucide-react";

export default function PublicQuizPage() {
  const { slug } = useParams();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Password gate
  const [needsPassword, setNeedsPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  // Player name
  const [playerName, setPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<string, string | number | boolean>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!slug) return;
      try {
        const q = await getQuizBySlug(slug as string);
        if (!q) {
          setNotFound(true);
          return;
        }

        if (q.accessPassword) {
          setNeedsPassword(true);
          setQuiz(q);
          setLoading(false);
          return;
        }

        setQuiz(q);
        const qs = await getPublicQuizQuestions(q);
        setQuestions(qs);
      } catch (error) {
        console.error("Error loading quiz:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [slug]);

  const handlePasswordSubmit = async () => {
    if (!quiz) return;
    if (passwordInput === quiz.accessPassword) {
      setNeedsPassword(false);
      setPasswordError(false);
      const qs = await getPublicQuizQuestions(quiz);
      setQuestions(qs);
    } else {
      setPasswordError(true);
    }
  };

  const handleStartQuiz = () => {
    if (!playerName.trim()) return;
    setGameStarted(true);
  };

  const handleSelectOption = (option: string) => {
    if (submitted) return;
    setAnswers({ ...answers, [currentQuestion.id]: option });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    try {
      // Auto-grade: for MCQ types, check if the selected option text
      // matches an option marked isCorrect. For free response, compare
      // against correctAnswer.
      let totalScore = 0;
      questions.forEach((q) => {
        const studentAnswer = answers[q.id];
        let isCorrect = false;

        if (q.options && q.options.length > 0) {
          // MCQ: student answer is the option text
          const selectedOption = q.options.find(
            (opt) => opt.text === studentAnswer,
          );
          isCorrect = selectedOption?.isCorrect === true;
        } else {
          // Free response
          isCorrect = studentAnswer === q.correctAnswer;
        }

        if (isCorrect) {
          const config = quiz.questions.find((c) => c.questionId === q.id);
          totalScore += config?.points || 0;
        }
      });
      setScore(totalScore);

      await submitPublicAttempt(
        quiz.id,
        quiz.publicSlug || "",
        playerName,
        answers,
        totalScore,
        quiz.totalPoints,
      );

      setSubmitted(true);
    } catch (error) {
      console.error("Submit failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader className="w-10 h-10 text-primary animate-spin" />
        <p className="text-white/40 font-bold tracking-widest uppercase text-xs">
          Loading Quiz...
        </p>
      </div>
    );
  }

  // --- Not Found ---
  if (notFound || !quiz) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-black text-white">Quiz Not Found</h1>
        <p className="text-white/40 max-w-md">
          This quiz link may have expired or been disabled by the instructor.
        </p>
      </div>
    );
  }

  // --- Password Gate ---
  if (needsPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="card max-w-md w-full p-10 text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">{quiz.title}</h1>
          <p className="text-white/40 mb-8">
            This quiz requires a password to access.
          </p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
            placeholder="Enter access password"
            className="input-field mb-4"
          />
          {passwordError && (
            <p className="text-red-400 text-sm mb-4">
              Incorrect password. Please try again.
            </p>
          )}
          <button
            onClick={handlePasswordSubmit}
            className="btn btn-primary w-full"
          >
            Unlock Quiz
          </button>
        </div>
      </div>
    );
  }

  // --- Name Entry / Start Screen ---
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="card max-w-lg w-full p-10 text-center">
          <div className="text-5xl mb-6">📝</div>
          <h1 className="text-3xl font-black text-white mb-2">{quiz.title}</h1>
          <p className="text-white/40 mb-2">{quiz.description}</p>
          <div className="flex justify-center gap-6 text-xs text-white/30 mb-8">
            <span>{questions.length} questions</span>
            <span>•</span>
            <span>{quiz.totalPoints} points</span>
            {quiz.timeLimitMinutes && (
              <>
                <span>•</span>
                <span>{quiz.timeLimitMinutes} min</span>
              </>
            )}
          </div>

          <div className="text-left mb-6">
            <label className="label">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStartQuiz()}
              placeholder="Enter your name to begin"
              className="input-field"
            />
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={!playerName.trim()}
            className={`btn btn-primary w-full text-lg py-4 ${!playerName.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Start Quiz →
          </button>

          <p className="text-white/20 text-xs mt-6">
            Powered by{" "}
            <span className="font-bold text-primary/60">TutorOS</span>
          </p>
        </div>
      </div>
    );
  }

  // --- Results Screen ---
  if (submitted) {
    const percentage =
      quiz.totalPoints > 0 ? Math.round((score / quiz.totalPoints) * 100) : 0;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="card max-w-lg w-full p-10 text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Quiz Complete!
          </h1>
          <p className="text-white/40 mb-8">Great job, {playerName}!</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-3xl font-black text-primary">{percentage}%</p>
              <p className="text-white/30 text-xs uppercase tracking-widest">
                Score
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-3xl font-black text-white">
                {score}/{quiz.totalPoints}
              </p>
              <p className="text-white/30 text-xs uppercase tracking-widest">
                Points
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-3xl font-black text-white">
                {answeredCount}/{questions.length}
              </p>
              <p className="text-white/30 text-xs uppercase tracking-widest">
                Answered
              </p>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="btn bg-white/5 hover:bg-white/10 text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </button>

          <p className="text-white/20 text-xs mt-8">
            Powered by{" "}
            <span className="font-bold text-primary/60">TutorOS</span>
          </p>
        </div>
      </div>
    );
  }

  // --- Quiz Player ---
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="font-bold text-sm tracking-tight">{quiz.title}</h1>
            <p className="text-[10px] uppercase font-black tracking-widest text-white/20">
              Question {currentIndex + 1} of {questions.length} • {playerName}
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

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn btn-primary py-2 text-xs"
        >
          {submitting ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            "Finish Quiz"
          )}
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 container max-w-4xl mx-auto py-12 px-6">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6 border border-primary/20">
              {currentQuestion.type.replace("_", " ")}
            </span>
            <div className="prose prose-invert max-w-none">
              <MathText
                as="div"
                className="text-xl leading-relaxed font-serif text-white/90"
              >
                {currentQuestion.content}
              </MathText>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {currentQuestion.options && currentQuestion.options.length > 0 && (
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
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/5 px-6 py-4 flex items-center justify-between sticky bottom-0 z-50">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="btn bg-white/5 hover:bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 mr-2" /> Previous
        </button>

        <div className="flex gap-2">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-primary w-6"
                  : answers[questions[i].id] !== undefined
                    ? "bg-secondary"
                    : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <button
          onClick={
            currentIndex === questions.length - 1 ? handleSubmit : handleNext
          }
          disabled={submitting}
          className="btn btn-primary"
        >
          {currentIndex === questions.length - 1 ? "Finish" : "Next"}{" "}
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </footer>
    </div>
  );
}
