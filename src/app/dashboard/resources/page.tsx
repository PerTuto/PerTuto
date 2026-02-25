"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  getResources,
  addResource,
  updateResource,
  deleteResource,
} from "@/lib/firebase/services";
import { uploadResourceFile } from "@/lib/firebase/storage-services";
import { ResourceType } from "@/lib/types";
import type { Resource } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  BookOpen,
  FileText,
  Upload,
  Sparkles,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CBSE_MATH_SEED_DATA } from "./seed-data";
import { ALL_ADDITIONAL_SEED_DATA } from "./seed-data-all";

const GRADES = ["8", "9", "10", "11", "12", "SL", "HL", "Core", "Extended", "AS", "A2"];
const CURRICULA = ["CBSE", "IB", "IGCSE", "A-Level"];
const RESOURCE_TYPES = [
  { value: ResourceType.Syllabus, label: "Syllabus" },
  { value: ResourceType.PastPaper, label: "Past Paper" },
  { value: ResourceType.StudyGuide, label: "Study Guide" },
  { value: ResourceType.FAQ, label: "FAQ" },
];

const TYPE_COLORS: Record<string, string> = {
  [ResourceType.Syllabus]: "bg-blue-50 text-blue-700 border-blue-200",
  [ResourceType.PastPaper]: "bg-purple-50 text-purple-700 border-purple-200",
  [ResourceType.StudyGuide]: "bg-green-50 text-green-700 border-green-200",
  [ResourceType.FAQ]: "bg-amber-50 text-amber-700 border-amber-200",
};

const TYPE_LABELS: Record<string, string> = {
  [ResourceType.Syllabus]: "Syllabus",
  [ResourceType.PastPaper]: "Past Paper",
  [ResourceType.StudyGuide]: "Study Guide",
  [ResourceType.FAQ]: "FAQ",
};

type FormData = {
  type: ResourceType;
  curriculum: string;
  subject: string;
  grade: string;
  title: string;
  content: string;
  year: string;
  session: string;
  tags: string;
  sortOrder: number;
  published: boolean;
};

const emptyForm: FormData = {
  type: ResourceType.Syllabus,
  curriculum: "CBSE",
  subject: "Mathematics",
  grade: "10",
  title: "",
  content: "",
  year: "",
  session: "",
  tags: "",
  sortOrder: 0,
  published: true,
};

export default function ResourcesPage() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const tenantId = userProfile?.tenantId;

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filters
  const [filterGrade, setFilterGrade] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPublished, setFilterPublished] = useState<string>("all");
  const [filterCurriculum, setFilterCurriculum] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (tenantId) fetchResources();
  }, [tenantId]);

  async function fetchResources() {
    if (!tenantId) return;
    setLoading(true);
    try {
      const data = await getResources(tenantId);
      setResources(
        data.sort(
          (a: any, b: any) =>
            a.grade?.localeCompare(b.grade) || a.sortOrder - b.sortOrder
        )
      );
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (filterGrade !== "all" && r.grade !== filterGrade) return false;
      if (filterType !== "all" && r.type !== filterType) return false;
      if (filterCurriculum !== "all" && r.curriculum !== filterCurriculum) return false;
      if (filterPublished === "published" && !r.published) return false;
      if (filterPublished === "draft" && r.published) return false;
      if (
        searchQuery &&
        !r.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [resources, filterGrade, filterType, filterCurriculum, filterPublished, searchQuery]);

  function openAddDialog() {
    setEditingId(null);
    setForm(emptyForm);
    setFile(null);
    setDialogOpen(true);
  }

  function openEditDialog(r: Resource) {
    setEditingId(r.id);
    setForm({
      type: r.type,
      curriculum: r.curriculum,
      subject: r.subject,
      grade: r.grade,
      title: r.title,
      content: r.content,
      year: r.year || "",
      session: r.session || "",
      tags: r.tags?.join(", ") || "",
      sortOrder: r.sortOrder || 0,
      published: r.published,
    });
    setFile(null);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!tenantId) return;
    if (!form.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const data: any = {
        type: form.type,
        curriculum: form.curriculum,
        subject: form.subject,
        grade: form.grade,
        title: form.title.trim(),
        content: form.content.trim(),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        sortOrder: form.sortOrder,
        published: form.published,
      };

      if (form.type === ResourceType.PastPaper) {
        data.year = form.year;
        data.session = form.session;
      }

      if (editingId) {
        // Upload file if provided
        if (file) {
          const url = await uploadResourceFile(file, editingId, tenantId);
          data.fileUrl = url;
          data.fileName = file.name;
        }
        await updateResource(tenantId, editingId, data);
        toast({ title: "Updated", description: "Resource updated." });
      } else {
        const id = await addResource(tenantId, data);
        // Upload file if provided
        if (file) {
          const url = await uploadResourceFile(file, id, tenantId);
          await updateResource(tenantId, id, {
            fileUrl: url,
            fileName: file.name,
          });
        }
        toast({ title: "Created", description: "Resource added." });
      }

      setDialogOpen(false);
      fetchResources();
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to save resource",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!tenantId) return;
    setProcessingId(id);
    try {
      await deleteResource(tenantId, id);
      setResources((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Deleted", description: "Resource removed." });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to delete",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleTogglePublished(r: Resource) {
    if (!tenantId) return;
    setProcessingId(r.id);
    try {
      await updateResource(tenantId, r.id, { published: !r.published });
      setResources((prev) =>
        prev.map((x) =>
          x.id === r.id ? { ...x, published: !x.published } : x
        )
      );
      toast({
        title: r.published ? "Unpublished" : "Published",
        description: `Resource is now ${r.published ? "draft" : "live"}.`,
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to update",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleSeedData(dataSet: "cbse" | "all") {
    if (!tenantId) return;
    setSeeding(true);
    try {
      const entries = dataSet === "cbse" ? CBSE_MATH_SEED_DATA : [...CBSE_MATH_SEED_DATA, ...ALL_ADDITIONAL_SEED_DATA];
      let count = 0;
      for (const entry of entries) {
        await addResource(tenantId, {
          ...entry,
          tenantId,
          tags: entry.tags || [],
          sortOrder: entry.sortOrder || 0,
          published: true,
        });
        count++;
      }
      toast({
        title: "Seeded!",
        description: `${count} syllabus entries created across all courses.`,
      });
      fetchResources();
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to seed data",
        variant: "destructive",
      });
    } finally {
      setSeeding(false);
    }
  }

  // Stats
  const totalCount = resources.length;
  const publishedCount = resources.filter((r) => r.published).length;
  const draftCount = totalCount - publishedCount;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Resources
          </h1>
          <p className="text-muted-foreground">
            Manage syllabus outlines, past papers, study guides, and FAQs.
          </p>
        </div>
        <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleSeedData("cbse")}
                disabled={seeding}
                className="gap-2"
              >
                {seeding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Seed CBSE
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSeedData("all")}
                disabled={seeding}
                className="gap-2"
              >
                {seeding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Seed All Courses
              </Button>
          <Button onClick={openAddDialog} className="gap-2">
            <Plus className="w-4 h-4" /> Add Resource
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Resources</div>
          <div className="text-2xl font-bold">{totalCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Published</div>
          <div className="text-2xl font-bold text-green-600">
            {publishedCount}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Drafts</div>
          <div className="text-2xl font-bold text-amber-600">{draftCount}</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterCurriculum} onValueChange={setFilterCurriculum}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Curriculum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Curricula</SelectItem>
            {CURRICULA.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterGrade} onValueChange={setFilterGrade}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {GRADES.map((g) => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {RESOURCE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPublished} onValueChange={setFilterPublished}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resource List */}
      {filtered.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No Resources Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {totalCount === 0
                ? 'Click "Seed All Courses" to auto-populate syllabus entries for CBSE, IB, IGCSE, and A-Level — or add resources manually.'
                : "No resources match your current filters."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((r) => (
            <Card key={r.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold truncate">{r.title}</span>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] shrink-0", TYPE_COLORS[r.type])}
                      >
                        {TYPE_LABELS[r.type]}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {r.curriculum} · {r.grade}
                      </Badge>
                      {!r.published && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-slate-100 text-slate-500 shrink-0"
                        >
                          Draft
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>
                        {r.curriculum} · {r.subject}
                      </span>
                      {r.year && <span>· {r.year}</span>}
                      {r.fileName && (
                        <span className="flex items-center gap-1">
                          · <FileText className="w-3 h-3" /> {r.fileName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleTogglePublished(r)}
                      disabled={processingId === r.id}
                      title={r.published ? "Unpublish" : "Publish"}
                    >
                      {r.published ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(r)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(r.id)}
                      disabled={processingId === r.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Resource" : "Add Resource"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Row 1: Type + Grade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, type: v as ResourceType }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCE_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Grade</label>
                <Select
                  value={form.grade}
                  onValueChange={(v) => setForm((p) => ({ ...p, grade: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={g}>
                        Class {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Curriculum + Subject */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Curriculum</label>
                <Input
                  value={form.curriculum}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, curriculum: e.target.value }))
                  }
                  placeholder="CBSE"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={form.subject}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, subject: e.target.value }))
                  }
                  placeholder="Mathematics"
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g., Chapter 3: Pair of Linear Equations"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Content{" "}
                <span className="text-muted-foreground font-normal">
                  (Markdown supported)
                </span>
              </label>
              <Textarea
                value={form.content}
                onChange={(e) =>
                  setForm((p) => ({ ...p, content: e.target.value }))
                }
                rows={6}
                placeholder={
                  form.type === ResourceType.FAQ
                    ? "The answer to the question..."
                    : form.type === ResourceType.Syllabus
                    ? "- Topic 1: ...\n- Topic 2: ..."
                    : "Write your content here..."
                }
              />
            </div>

            {/* Past Paper specific fields */}
            {form.type === ResourceType.PastPaper && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    value={form.year}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, year: e.target.value }))
                    }
                    placeholder="2024"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session</label>
                  <Input
                    value={form.session}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, session: e.target.value }))
                    }
                    placeholder="March / Compartment"
                  />
                </div>
              </div>
            )}

            {/* File upload for past papers */}
            {form.type === ResourceType.PastPaper && (
              <div className="space-y-2">
                <label className="text-sm font-medium">PDF File</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {file ? file.name : "Choose PDF..."}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) =>
                        setFile(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                  {file && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setFile(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Tags + Sort + Published */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <Input
                  value={form.tags}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tags: e.target.value }))
                  }
                  placeholder="algebra, board-exam"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort Order</label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      sortOrder: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={form.published ? "published" : "draft"}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, published: v === "published" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingId ? "Save Changes" : "Create Resource"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
