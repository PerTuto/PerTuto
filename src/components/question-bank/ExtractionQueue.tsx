
"use client";

import React, { useState, useMemo } from "react";
import { Question, QuestionType, QuestionDifficulty } from "../../lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Check, 
  X, 
  Edit2, 
  Trash2, 
  ArrowRight, 
  RotateCcw, 
  ChevronRight, 
  CheckSquare, 
  Square,
  Sparkles,
  Loader2,
  FileText
} from "lucide-react";
import QuestionCard from "./QuestionCard";
import QuestionEditor from "./QuestionEditor";
import { useToast } from "@/hooks/use-toast";
import { batchCreateQuestions } from "../../lib/firebase/services/questions";
import { useParams, useRouter } from "next/navigation";

interface ExtractedQuestion extends Partial<Question> {
  tempId: string;
  selected: boolean;
}

interface ExtractionQueueProps {
  questions: any[]; // Raw extracted questions
  pdfUrl?: string;
  onDone: () => void;
  onCancel: () => void;
}

export default function ExtractionQueue({
  questions: initialQuestions,
  pdfUrl,
  onDone,
  onCancel,
}: ExtractionQueueProps) {
  const { tenantId } = useParams() as { tenantId: string };
  const router = useRouter();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<ExtractedQuestion[]>(
    initialQuestions.map((q, i) => ({
      ...q,
      tempId: `ext-${i}-${Date.now()}`,
      selected: true,
      status: "PENDING",
    }))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const selectedCount = useMemo(() => questions.filter((q) => q.selected).length, [questions]);
  const editingQuestion = useMemo(() => questions.find((q) => q.tempId === editingId), [questions, editingId]);

  const toggleSelect = (tempId: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.tempId === tempId ? { ...q, selected: !q.selected } : q))
    );
  };

  const toggleSelectAll = () => {
    const allSelected = questions.every((q) => q.selected);
    setQuestions((prev) => prev.map((q) => ({ ...q, selected: !allSelected })));
  };

  const removeQuestion = (tempId: string) => {
    setQuestions((prev) => prev.filter((q) => q.tempId !== tempId));
  };

  const handleUpdate = async (data: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.tempId === editingId ? { ...q, ...data } : q))
    );
    setEditingId(null);
    toast({
      title: "Success",
      description: "Question updated locally",
    });
  };

  const handlePublish = async () => {
    const toPublish = questions.filter((q) => q.selected);
    if (toPublish.length === 0) return;

    setIsPublishing(true);
    try {
      // Map and clean up for final save
      const finalQuestions = toPublish.map(({ tempId, selected, ...rest }) => ({
        ...rest,
        status: "APPROVED",
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await batchCreateQuestions(tenantId, finalQuestions as Question[]);
      toast({
        title: "Questions Published",
        description: `Successfully published ${finalQuestions.length} questions to the bank.`,
      });
      onDone();
    } catch (error) {
      console.error("Publishing error:", error);
      toast({
        title: "Error",
        description: "Failed to publish questions",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (editingId && editingQuestion) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <QuestionEditor
          initialData={editingQuestion}
          onSubmit={handleUpdate}
          onCancel={() => setEditingId(null)}
          loading={false}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between sticky top-0 z-20 bg-background/80 backdrop-blur-md py-4 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-slate-600 dark:text-white/40 hover:text-slate-900 dark:hover:text-white">
            <RotateCcw className="w-4 h-4 me-2" /> Start Over
          </Button>
          <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />
          <p className="text-sm font-medium text-muted-foreground dark:text-white/60">
            Reviewing <span className="text-slate-900 dark:text-white">{questions.length}</span> extracted questions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectAll}
            className="h-9 border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-wider"
          >
            {questions.every((q) => q.selected) ? (
              <Square className="w-3 h-3 me-2" />
            ) : (
              <CheckSquare className="w-3 h-3 me-2" />
            )}
            {questions.every((q) => q.selected) ? "Deselect All" : "Select All"}
          </Button>

          <Button
            onClick={handlePublish}
            disabled={selectedCount === 0 || isPublishing}
            className="h-9 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold uppercase tracking-wider px-6 rounded-xl"
          >
            {isPublishing ? (
              <Loader2 className="w-3 h-3 animate-spin me-2" />
            ) : (
              <Check className="w-3 h-3 me-2" />
            )}
            Publish {selectedCount} Questions
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((q) => (
          <div key={q.tempId} className="relative group">
            <div 
              className={`absolute -top-2 -start-2 z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                q.selected ? "bg-primary border-primary text-white" : "bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-white/20 text-transparent hover:border-slate-400 dark:hover:border-white/40"
              }`}
              onClick={() => toggleSelect(q.tempId)}
            >
              <Check className="w-4 h-4" />
            </div>
            
            <div className={!q.selected ? "opacity-40 grayscale-[0.5] transition-all" : "transition-all"}>
              <QuestionCard
                question={q as Question}
                showActions={false}
              />
            </div>

            <div className="absolute top-2 end-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-white/80 dark:bg-black/60 backdrop-blur border border-slate-200 dark:border-white/10"
                onClick={() => setEditingId(q.tempId)}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={() => removeQuestion(q.tempId)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <Card className="bg-slate-50 dark:bg-white/5 border-dashed border-slate-200 dark:border-white/10 p-12 text-center text-muted-foreground dark:text-white/40">
          <CardContent className="space-y-4">
            <FileText className="w-12 h-12 mx-auto opacity-20" />
            <p>No questions left in the queue.</p>
            <Button variant="outline" onClick={onCancel} className="mt-4">
              Try Another Document
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
