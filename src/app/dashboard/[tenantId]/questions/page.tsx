
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getQuestions, deleteQuestion, createQuestion, updateQuestion } from "../../../../lib/firebase/services/questions";
import { Question } from "../../../../lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Sparkles, 
  Filter, 
  LayoutGrid, 
  List,
  Loader2,
  Database
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import QuestionCard from "@/components/question-bank/QuestionCard";
import QuestionEditor from "@/components/question-bank/QuestionEditor";
import { useToast } from "@/hooks/use-toast";

export default function QuestionsPage() {
  const { tenantId } = useParams() as { tenantId: string };
  const router = useRouter();
  const { toast } = useToast();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { questions: data } = await getQuestions(tenantId);
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions", error);
      toast({
        title: "Error",
        description: "Failed to load question bank",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [tenantId]);

  const handleDelete = async (id: string) => {
    try {
      await deleteQuestion(tenantId, id);
      setQuestions(prev => prev.filter(q => q.id !== id));
      toast({ title: "Deleted", description: "Question removed from bank" });
    } catch (error) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  const handleSave = async (data: Partial<Question>) => {
    try {
      if (editingQuestion?.id) {
        await updateQuestion(tenantId, editingQuestion.id, data);
        toast({ title: "Updated", description: "Question updated successfully" });
      } else {
        await createQuestion(tenantId, data as Omit<Question, "id" | "createdAt" | "updatedAt">);
        toast({ title: "Created", description: "Question added to bank" });
      }
      setIsAdding(false);
      setEditingQuestion(null);
      fetchQuestions();
    } catch (error) {
      toast({ title: "Error", description: "Save failed", variant: "destructive" });
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.stem.toLowerCase().includes(search.toLowerCase()) ||
    q.taxonomy.topicId.toLowerCase().includes(search.toLowerCase())
  );

  if (isAdding || editingQuestion) {
    return (
      <div className="container mx-auto py-8">
        <QuestionEditor
          initialData={editingQuestion || {}}
          onSubmit={handleSave}
          onCancel={() => {
            setIsAdding(false);
            setEditingQuestion(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-outfit text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" /> Question Bank
          </h1>
          <p className="text-muted-foreground dark:text-white/40">Manage your tenant's shared repository of learning materials.</p>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white bg-transparent"
            onClick={() => router.push(`/dashboard/${tenantId}/questions/extract`)}
          >
            <Sparkles className="w-4 h-4 me-2" /> AI Extract
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 me-2" /> New Question
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-white/40 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by content, topic, or tags..." 
            className="ps-10 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-11 rounded-xl w-full text-slate-900 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60">
          <Filter className="w-4 h-4 me-2" /> Filter
        </Button>
        <div className="flex bg-slate-50 dark:bg-white/5 p-1 rounded-lg border border-slate-200 dark:border-white/5">
          <Button variant="secondary" size="icon" className="h-9 w-9 bg-primary/20 text-primary">
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground dark:text-white/40 hover:text-slate-900 dark:hover:text-white">
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground dark:text-white/40 font-medium">Fetching question repository...</p>
        </div>
      ) : filteredQuestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((q) => (
            <QuestionCard 
              key={q.id} 
              question={q} 
              onEdit={setEditingQuestion}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-slate-50 dark:bg-white/5 border-dashed border-slate-200 dark:border-white/10 p-24 text-center">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Database className="w-8 h-8 text-muted-foreground dark:text-white/40" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No questions found</h3>
            <p className="text-muted-foreground dark:text-white/60 max-w-sm mx-auto">
              {search ? `Your search for "${search}" didn't return any results.` : "The question bank is empty. Get started by adding a question manually or using AI extraction."}
            </p>
            {search && (
              <Button variant="link" className="text-primary" onClick={() => setSearch("")}>Clear Search</Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
