
"use client";

import React, { useState } from "react";
import { Question, QuestionType, QuestionDifficulty, QuestionStatus, CognitiveDepth } from "../../lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Plus, X, Eye, Edit2, CheckCircle2, Circle } from "lucide-react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import TaxonomyPicker from "./TaxonomyPicker";

interface QuestionEditorProps {
  initialData?: Partial<Question>;
  onSubmit: (data: Partial<Question>) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export default function QuestionEditor({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: QuestionEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState<Partial<Question>>({
    stem: "",
    type: "MCQ_SINGLE",
    difficulty: "EASY",
    status: "DRAFT",
    options: [],
    correctAnswer: "",
    explanation: "",
    taxonomy: {
      domainId: "",
      topicId: "",
      subTopicId: "",
      cognitiveDepth: "CONCEPTUAL",
      scaffoldLevel: 1,
      curriculum: "",
    },
    source: { origin: "MANUAL" },
    ...initialData,
  });

  const isMCQ = formData.type === "MCQ_SINGLE" || formData.type === "MCQ_MULTI";

  const renderContent = (text: string) => {
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

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...(prev.options || []),
        { id: Math.random().toString(36).substr(2, 9), text: "", isCorrect: false },
      ],
    }));
  };

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: (prev.options || []).filter((_, i) => i !== index),
    }));
  };

  const updateOption = (index: number, updates: any) => {
    setFormData((prev) => {
      const newOptions = [...(prev.options || [])];
      newOptions[index] = { ...newOptions[index], ...updates };
      
      // If MCQ_SINGLE, ensure only one is correct
      if (prev.type === "MCQ_SINGLE" && updates.isCorrect) {
        newOptions.forEach((opt, i) => {
          if (i !== index) opt.isCorrect = false;
        });
      }
      
      return { ...prev, options: newOptions };
    });
  };

  return (
    <Card className="bg-glass border-slate-200 dark:border-white/5 max-w-4xl mx-auto overflow-hidden">
      <CardHeader className="p-6 border-b border-slate-200 dark:border-white/5 flex flex-row items-center justify-between bg-slate-50 dark:bg-white/5">
        <CardTitle className="text-xl font-bold font-outfit text-slate-900 dark:text-white">
          {formData.id ? "Edit Question" : "New Question"}
        </CardTitle>
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg border border-slate-200 dark:border-white/5">
          <Button
            variant={!isPreview ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setIsPreview(false)}
            className="h-8 text-[10px] font-bold uppercase tracking-wider text-slate-900 dark:text-white"
          >
            <Edit2 className="w-3 h-3 me-2" /> Edit
          </Button>
          <Button
            variant={isPreview ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setIsPreview(true)}
            className="h-8 text-[10px] font-bold uppercase tracking-wider"
          >
            <Eye className="w-3 h-3 me-2" /> Preview
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8 h-[70vh] overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/30 tracking-widest">Type & Difficulty</Label>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={formData.type}
                  onValueChange={(val: QuestionType) => setFormData({ ...formData, type: val })}
                >
                  <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white h-11 rounded-xl">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                    <SelectItem value="MCQ_SINGLE">Single Choice</SelectItem>
                    <SelectItem value="MCQ_MULTI">Multiple Choice</SelectItem>
                    <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                    <SelectItem value="FILL_IN_BLANK">Fill in Blank</SelectItem>
                    <SelectItem value="FREE_RESPONSE">Free Response</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={formData.difficulty}
                  onValueChange={(val: QuestionDifficulty) => setFormData({ ...formData, difficulty: val })}
                >
                  <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white h-11 rounded-xl">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                    <SelectItem value="OLYMPIAD">Olympiad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/30 tracking-widest">Taxonomy</Label>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                <TaxonomyPicker
                  value={{
                    domainId: formData.taxonomy?.domainId,
                    topicId: formData.taxonomy?.topicId,
                    subTopicId: formData.taxonomy?.subTopicId,
                  }}
                  onChange={(val) => setFormData({
                    ...formData,
                    taxonomy: { ...formData.taxonomy!, ...val } as any
                  })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/30 tracking-widest">Question Stem</Label>
              {isPreview ? (
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 min-h-[140px] text-sm leading-relaxed font-outfit text-slate-900 dark:text-white/80">
                  {renderContent(formData.stem || "")}
                </div>
              ) : (
                <Textarea
                  className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white min-h-[140px] rounded-xl font-mono text-sm resize-none focus:ring-primary/20"
                  placeholder="Enter question text... use $x^2$ for math"
                  value={formData.stem}
                  onChange={(e) => setFormData({ ...formData, stem: e.target.value })}
                />
              )}
            </div>

            {isMCQ && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/30 tracking-widest">Options</Label>
                  <Button variant="ghost" size="sm" onClick={addOption} className="text-[10px] font-bold text-primary hover:text-primary hover:bg-primary/10">
                    <Plus className="w-3 h-3 me-1" /> Add Option
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.options?.map((opt, i) => (
                    <div key={opt.id} className="flex gap-3 items-start group">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateOption(i, { isCorrect: !opt.isCorrect })}
                        className={`h-9 w-9 rounded-xl shrink-0 transition-all ${
                          opt.isCorrect ? "bg-green-500/10 text-green-600 dark:text-green-500 border border-green-500/20" : "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-muted-foreground dark:text-white/20 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {opt.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </Button>
                      <div className="flex-1 space-y-2">
                        <Input
                          className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white h-9 rounded-lg text-sm"
                          placeholder={`Option ${i+1}`}
                          value={opt.text}
                          onChange={(e) => updateOption(i, { text: e.target.value })}
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeOption(i)} className="h-9 w-9 text-red-500/30 hover:text-red-500 hover:bg-red-500/10">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isMCQ && (
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/30 tracking-widest">Correct Answer</Label>
                <Input
                  className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white h-11 rounded-xl"
                  placeholder="The definitive answer"
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground dark:text-white/30 tracking-widest">Explanation & Solutions</Label>
          <Textarea
            className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white min-h-[100px] rounded-xl text-sm resize-none focus:ring-primary/20"
            placeholder="Help students understand the solution..."
            value={formData.explanation}
            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          />
        </div>
      </CardContent>

      <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} className="text-muted-foreground dark:text-white/40 hover:text-slate-900 dark:hover:text-white">
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit(formData)}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white px-8 rounded-xl font-bold font-outfit"
        >
          {loading ? "Processing..." : (
            <>
              <Save className="w-4 h-4 me-2" /> Save Question
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
