'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, Beaker } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  subject: string;
}

const QUESTIONS: Question[] = [
  {
    subject: 'IB Math AA',
    question: 'What is the derivative of f(x) = x³ + 2x?',
    options: ['3x² + 2', '3x² + 2x', 'x² + 2', '3x + 2'],
    correct: 0,
    explanation: 'Using the power rule: d/dx(x³) = 3x² and d/dx(2x) = 2. So f\'(x) = 3x² + 2.',
  },
  {
    subject: 'IGCSE Physics',
    question: 'What is the SI unit of electrical resistance?',
    options: ['Ampere', 'Volt', 'Ohm', 'Watt'],
    correct: 2,
    explanation: 'Resistance is measured in Ohms (Ω). R = V/I, where V is voltage and I is current.',
  },
  {
    subject: 'A-Level Chemistry',
    question: 'Which element has the highest electronegativity?',
    options: ['Oxygen', 'Chlorine', 'Nitrogen', 'Fluorine'],
    correct: 3,
    explanation: 'Fluorine (3.98 on the Pauling scale) is the most electronegative element due to its small atomic radius and high nuclear charge.',
  },
  {
    subject: 'Data Science',
    question: 'What does the R² metric measure in regression?',
    options: ['Correlation', 'Variance explained', 'Mean error', 'Bias'],
    correct: 1,
    explanation: 'R² (coefficient of determination) tells you the proportion of variance in the dependent variable explained by the model.',
  },
];

/**
 * LabExperience — An interactive mini-quiz card that gives visitors
 * a taste of PerTuto's teaching approach. Cycles through questions
 * from different curricula with instant feedback and explanations.
 */
export function LabExperience({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setVisible(true), 200);
      return () => clearTimeout(t);
    }
  }, [isInView]);

  const q = QUESTIONS[currentQ];

  const handleSelect = useCallback((idx: number) => {
    if (selected !== null) return; // already answered
    setSelected(idx);
    setShowExplanation(true);
    if (idx === q.correct) {
      setScore((s) => s + 1);
    }
  }, [selected, q.correct]);

  const handleNext = useCallback(() => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  }, [currentQ]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  }, []);

  return (
    <section ref={containerRef} className={`py-16 md:py-20 px-6 ${className}`}>
      <div
        className="max-w-2xl mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-4">
            <Beaker className="w-4 h-4" />
            Try It Yourself
          </div>
          <h2 className="text-2xl md:text-4xl font-headline font-bold tracking-tight text-foreground">
            Experience Our Teaching
          </h2>
          <p className="text-muted-foreground mt-2">Quick questions from our actual curriculum. See how we explain.</p>
        </div>

        {/* Quiz Card */}
        <div className="rounded-2xl border border-border bg-white shadow-lg overflow-hidden">
          {!completed ? (
            <>
              {/* Progress bar */}
              <div className="h-1.5 bg-secondary">
                <div
                  className="h-full bg-primary rounded-r-full transition-all duration-500"
                  style={{ width: `${((currentQ + (selected !== null ? 1 : 0)) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="p-6 md:p-8">
                {/* Subject tag + counter */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {q.subject}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">
                    {currentQ + 1}/{QUESTIONS.length}
                  </span>
                </div>

                {/* Question */}
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-6 leading-snug">
                  {q.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {q.options.map((option, idx) => {
                    const isCorrect = idx === q.correct;
                    const isSelected = idx === selected;
                    let optionStyle = 'border-border hover:border-primary/40 hover:bg-primary/5';
                    if (selected !== null) {
                      if (isCorrect) optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800';
                      else if (isSelected && !isCorrect) optionStyle = 'border-red-400 bg-red-50 text-red-700';
                      else optionStyle = 'border-border opacity-50';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        disabled={selected !== null}
                        className={`w-full text-left px-5 py-3.5 rounded-xl border-2 font-medium transition-all duration-300 flex items-center gap-3 ${optionStyle} ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {selected !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                        {selected !== null && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showExplanation && (
                  <div
                    className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20"
                    style={{ animation: 'fadeSlideUp 0.3s ease forwards' }}
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-primary mb-1">
                          {selected === q.correct ? 'Correct! 🎉' : 'Not quite — here\'s why:'}
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Next button */}
                {selected !== null && (
                  <button
                    onClick={handleNext}
                    className="mt-6 w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    {currentQ < QUESTIONS.length - 1 ? (
                      <>Next Question <ArrowRight className="w-4 h-4" /></>
                    ) : (
                      <>See Results <Sparkles className="w-4 h-4" /></>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Results */
            <div className="p-8 md:p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-primary">{score}/{QUESTIONS.length}</span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-foreground mb-2">
                {score === QUESTIONS.length ? 'Perfect Score! 🏆' : score >= QUESTIONS.length / 2 ? 'Great Work! 💪' : 'Keep Learning! 📚'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {score === QUESTIONS.length
                  ? 'You nailed every question. Imagine what structured tutoring could unlock.'
                  : 'Our tutors break down every concept until it clicks — just like those explanations above.'}
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-xl border-2 border-border font-bold text-sm uppercase tracking-wider text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
                <a
                  href="#book-demo"
                  className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  Book Free Demo <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
