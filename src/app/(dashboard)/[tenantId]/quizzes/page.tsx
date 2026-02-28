
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getQuizzes, createQuiz, deleteQuiz, updateQuiz } from "../../../../lib/firebase/services/quizzes";
import { Quiz } from "../../../../lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  ClipboardList, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Play,
  Share2,
  Lock,
  Globe,
  Loader2,
  Clock,
  LayoutGrid,
  List
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import QuizCreator from "@/components/question-bank/QuizCreator";

export default function QuizzesPage() {
  const { tenantId } = useParams() as { tenantId: string };
  const router = useRouter();
  const { toast } = useToast();
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [search, setSearch] = useState("");

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await getQuizzes(tenantId);
      setQuizzes(data);
    } catch (error) {
      console.error("Failed to fetch quizzes", error);
      toast({ title: "Error", description: "Failed to load quizzes", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [tenantId]);

  const handleCreate = async (data: any) => {
    try {
      await createQuiz(tenantId, data);
      setIsAdding(false);
      fetchQuizzes();
      toast({ title: "Success", description: "Quiz created successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create quiz", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQuiz(tenantId, id);
      setQuizzes(prev => prev.filter(q => q.id !== id));
      toast({ title: "Deleted", description: "Quiz removed" });
    } catch (error) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    q.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (isAdding || editingQuiz) {
    return (
      <div className="container mx-auto py-8">
        <QuizCreator
          initialData={editingQuiz || {}}
          onSubmit={handleCreate}
          onCancel={() => {
            setIsAdding(false);
            setEditingQuiz(null);
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
            <ClipboardList className="w-8 h-8 text-primary" /> Assessments
          </h1>
          <p className="text-muted-foreground dark:text-white/40">Manage and assign quizzes to students or batches.</p>
        </div>

        <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 shadow-lg shadow-primary/20" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 me-2" /> Create Quiz
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 dark:text-white/20 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search quizzes by title or topic..." 
            className="ps-10 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 h-11 rounded-xl w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg border border-slate-200 dark:border-white/5">
          <Button variant="secondary" size="icon" className="h-9 w-9 bg-primary/20 text-primary">
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground dark:text-white/40">
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground dark:text-white/20 font-medium">Loading assessments...</p>
        </div>
      ) : filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="bg-glass border-slate-200 dark:border-white/5 group hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-500 overflow-hidden flex flex-col">
              <div className="absolute top-0 end-0 p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground dark:text-white/20 hover:text-slate-900 dark:hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setEditingQuiz(quiz)}>
                      <Edit className="w-4 h-4 me-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Share2 className="w-4 h-4 me-2" /> Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={() => handleDelete(quiz.id)}>
                      <Trash2 className="w-4 h-4 me-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-widest">
                    {quiz.questions.length} Questions
                  </Badge>
                  {quiz.isPublic ? (
                    <Badge variant="outline" className="border-green-500/30 bg-green-500/5 text-green-600 dark:text-green-500 text-[10px] uppercase font-bold tracking-widest">
                      <Globe className="w-3 h-3 me-1" /> Public
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-muted-foreground dark:text-white/40 text-[10px] uppercase font-bold tracking-widest">
                      <Lock className="w-3 h-3 me-1" /> Private
                    </Badge>
                  )}
                </div>
                <CardTitle className="font-outfit text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{quiz.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs leading-relaxed min-h-[32px] text-muted-foreground">
                  {quiz.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 mt-auto border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground dark:text-white/40">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{quiz.settings.timeLimit}m</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-white/60">
                    <span>{quiz.totalPoints} pts</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10 font-bold text-[10px] uppercase tracking-wider">
                  Details <Play className="w-3 h-3 ms-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-50 dark:bg-white/5 border-dashed border-slate-200 dark:border-white/10 p-24 text-center">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
              <ClipboardList className="w-8 h-8 text-muted-foreground dark:text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No quizzes yet</h3>
            <p className="text-muted-foreground dark:text-white/40 max-w-sm mx-auto">
              Ready to assess your students? Create your first quiz manually or with AI assistance.
            </p>
            <Button className="mt-6 bg-primary" onClick={() => setIsAdding(true)}>
              Get Started
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
