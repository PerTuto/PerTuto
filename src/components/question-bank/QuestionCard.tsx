
"use client";

import React from "react";
import { Question, QuestionType } from "../../lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import FigureRenderer from "./FigureRenderer";

interface QuestionCardProps {
  question: Question;
  onEdit?: (q: Question) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: Question['status']) => void;
  showActions?: boolean;
}

export default function QuestionCard({
  question,
  onEdit,
  onDelete,
  onStatusChange,
  showActions = true,
}: QuestionCardProps) {
  const isMCQ = question.type === "MCQ_SINGLE" || question.type === "MCQ_MULTI";

  const renderContent = (text: string) => {
    // Basic KaTeX parser for $...$ and $$...$$
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$.*?\$)/g);
    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith("$$") && part.endsWith("$$")) {
            return <BlockMath key={i}>{part.slice(2, -2)}</BlockMath>;
          } else if (part.startsWith("$") && part.endsWith("$")) {
            return <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>;
          }
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };

  const getDifficultyColor = (d: Question['difficulty']) => {
    switch (d) {
      case "EASY": return "bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20";
      case "MEDIUM": return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20";
      case "HARD": return "bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20";
      case "OLYMPIAD": return "bg-purple-500/10 text-purple-600 dark:text-purple-500 border-purple-500/20";
      default: return "bg-slate-100 dark:bg-white/10 text-muted-foreground dark:text-white/60";
    }
  };

  return (
    <Card className="bg-glass border-slate-200 dark:border-white/5 overflow-hidden group">
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 bg-slate-50 dark:bg-transparent border-b border-transparent dark:border-transparent">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
            {question.difficulty}
          </Badge>
          <Badge variant="secondary" className="bg-slate-100 dark:bg-white/5 text-muted-foreground dark:text-white/40 border-slate-200 dark:border-white/10">
            {question.type.replace("_", " ")}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {question.status === "APPROVED" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          {question.status === "PENDING" && <AlertCircle className="w-4 h-4 text-yellow-500" />}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-4 space-y-4">
        <div className="text-sm text-slate-900 dark:text-white/80 leading-relaxed font-outfit">
          {renderContent(question.stem)}
        </div>

        {question.figures && question.figures.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {question.figures.map((fig, i) => (
              <FigureRenderer key={i} {...fig} />
            ))}
          </div>
        )}

        {isMCQ && question.options && (
          <div className="space-y-2 mt-4">
            {question.options.map((opt) => (
              <div
                key={opt.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                  opt.isCorrect 
                    ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400" 
                    : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60"
                }`}
              >
                {opt.isCorrect ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <Circle className="w-4 h-4 mt-0.5 shrink-0 opacity-40 text-muted-foreground dark:text-inherit" />}
                <span className="text-xs">{renderContent(opt.text)}</span>
              </div>
            ))}
          </div>
        )}

        {!isMCQ && question.correctAnswer && (
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 mt-4">
            <p className="text-[10px] uppercase tracking-wider font-bold text-primary mb-1">Correct Answer</p>
            <p className="text-sm text-slate-900 dark:text-white">{renderContent(question.correctAnswer)}</p>
          </div>
        )}

        {question.explanation && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 mt-2">
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground dark:text-white/30 mb-1">Explanation</p>
            <p className="text-xs text-slate-600 dark:text-white/50 line-clamp-3 group-hover:line-clamp-none transition-all">
              {renderContent(question.explanation)}
            </p>
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="p-4 pt-0 flex justify-end gap-2 border-t border-slate-200 dark:border-white/5 mt-4 transition-opacity opacity-0 group-hover:opacity-100">
          <Button variant="ghost" size="sm" onClick={() => onEdit?.(question)} className="h-8 text-[10px] text-muted-foreground dark:text-white/40 hover:text-slate-900 dark:hover:text-white">
            <Edit2 className="w-3 h-3 me-1" /> Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete?.(question.id)} className="h-8 text-[10px] text-red-500/60 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-500/10">
            <Trash2 className="w-3 h-3 me-1" /> Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
