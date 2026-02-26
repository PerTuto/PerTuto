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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const VERTICALS = [
  { value: "k12", label: "K-12 Tutoring" },
  { value: "higher-ed", label: "Higher Education" },
  { value: "professional", label: "Professional" },
];
const GRADES = ["8", "9", "10", "11", "12", "SL", "HL", "Core", "Extended", "AS", "A2", "Undergraduate", "Postgraduate", "All Levels", "Beginner", "Intermediate", "Advanced"];
const CURRICULA = ["CBSE", "IB", "IGCSE", "A-Level", "University", "Professional"];
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
  vertical: string;
  type: ResourceType;
  board: string;
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
  vertical: "k12",
  type: ResourceType.Syllabus,
  board: "CBSE",
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
  const [file, setFile] = useState<File | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filters
  const [filterVertical, setFilterVertical] = useState<string>("k12");
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
      if (filterVertical !== "all" && (r as any).vertical !== filterVertical) return false;
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
  }, [resources, filterVertical, filterGrade, filterType, filterCurriculum, filterPublished, searchQuery]);

  function openAddDialog() {
    setEditingId(null);
    setForm(emptyForm);
    setFile(null);
    setDialogOpen(true);
  }

  function openEditDialog(r: Resource) {
    setEditingId(r.id);
    setForm({
      vertical: r.vertical || "k12",
      type: r.type,
      board: r.board || r.curriculum || "",
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
        vertical: form.vertical,
        type: form.type,
        board: form.board,
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

  // Stats (calculated only for the currently active vertical tab)
  const verticalResources = resources.filter((r) => (r as any).vertical === filterVertical);
  const totalCount = verticalResources.length;
  const publishedCount = verticalResources.filter((r) => r.published).length;
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
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Resources
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage syllabus outlines, past papers, study guides, and FAQs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={openAddDialog} className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white">
            <Plus className="w-4 h-4" /> Add Resource
          </Button>
        </div>
      </div>

      {/* Main Tabs Container */}
      <Tabs value={filterVertical} onValueChange={setFilterVertical} className="space-y-6">
        <TabsList className="bg-white border rounded-lg p-1 h-12 flex w-full max-w-md shadow-sm">
          {VERTICALS.map(v => (
            <TabsTrigger key={v.value} value={v.value} className="flex-1 py-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 font-medium">
              {v.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={filterVertical} className="space-y-6 focus-visible:outline-none focus-visible:ring-0 !mt-0">
          
          {/* Dynamic KPI Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 flex items-center gap-4 bg-white border-slate-200 shadow-sm transition-shadow hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500">Total Resources</div>
                <div className="text-3xl font-bold font-headline text-slate-900">{totalCount}</div>
              </div>
            </Card>
            
            <Card className="p-5 flex items-center gap-4 bg-white border-slate-200 shadow-sm transition-shadow hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-green-600">Published Live</div>
                <div className="text-3xl font-bold font-headline text-slate-900">{publishedCount}</div>
              </div>
            </Card>

            <Card className="p-5 flex items-center gap-4 bg-white border-slate-200 shadow-sm transition-shadow hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <Pencil className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-amber-600">Drafts</div>
                <div className="text-3xl font-bold font-headline text-slate-900">{draftCount}</div>
              </div>
            </Card>
          </div>

          {/* Faceted CRM Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search resources by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500"
              />
            </div>
            <Select value={filterCurriculum} onValueChange={setFilterCurriculum}>
              <SelectTrigger className="w-full md:w-[150px] bg-slate-50 border-slate-200">
                <SelectValue placeholder="Board/Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Boards</SelectItem>
                {CURRICULA.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterGrade} onValueChange={setFilterGrade}>
              <SelectTrigger className="w-full md:w-[140px] bg-slate-50 border-slate-200">
                <SelectValue placeholder="Level/Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {GRADES.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[160px] bg-slate-50 border-slate-200">
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
              <SelectTrigger className="w-full md:w-[140px] bg-slate-50 border-slate-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Clear Filters Button (appears if any filter is active) */}
            {(searchQuery || filterCurriculum !== "all" || filterGrade !== "all" || filterType !== "all" || filterPublished !== "all") && (
               <Button 
                variant="ghost" 
                onClick={() => {
                  setSearchQuery("");
                  setFilterCurriculum("all");
                  setFilterGrade("all");
                  setFilterType("all");
                  setFilterPublished("all");
                }}
                className="text-slate-500 hover:text-slate-900 w-full md:w-auto"
               >
                 <X className="w-4 h-4 mr-2" /> Clear
               </Button>
            )}
          </div>

          {/* Structured CRM Data Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center text-slate-500">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Database className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-headline font-semibold text-slate-900 mb-2">No Resources Found</h3>
                <p className="max-w-md">
                  {totalCount === 0
                    ? `You don't have any materials stored for ${VERTICALS.find(v => v.value === filterVertical)?.label}. Click "Add Resource" to add missing materials.`
                    : "No resources matched your active filter criteria."}
                </p>
                {totalCount === 0 && (
                  <Button onClick={openAddDialog} className="mt-6 gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4" /> Add First Resource
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-slate-200">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[30%]">Title</TableHead>
                      <TableHead>Pathway & Subject</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => (
                      <TableRow key={r.id} className="group transition-colors">
                        
                        <TableCell className="font-medium align-top">
                          <div className="flex items-start flex-col gap-1">
                            <span className="text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{r.title}</span>
                            {r.fileName && (
                              <span className="flex items-center gap-1 text-xs text-slate-500 line-clamp-1">
                                <FileText className="w-3 h-3" /> {r.fileName}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-sm align-top">
                           <div className="flex flex-col gap-1 text-slate-600">
                             <div className="flex items-center gap-2">
                               <span className="font-semibold text-slate-800">{r.board || r.curriculum}</span>
                               <span className="text-slate-400">•</span>
                               <span>{r.subject}</span>
                             </div>
                             <div className="text-xs text-slate-500">
                               {r.grade} {r.year ? `(${r.year})` : ""}
                             </div>
                           </div>
                        </TableCell>

                        <TableCell className="align-top">
                          <Badge variant="outline" className={cn("text-[11px] font-medium tracking-wide shadow-sm", TYPE_COLORS[r.type])}>
                            {TYPE_LABELS[r.type]}
                          </Badge>
                        </TableCell>

                        <TableCell className="align-top text-center">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[11px] border-transparent shadow-sm",
                              r.published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                            )}>
                            {r.published ? "Live" : "Draft"}
                          </Badge>
                        </TableCell>

                        <TableCell className="align-top text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                              onClick={() => handleTogglePublished(r)}
                              disabled={processingId === r.id}
                              title={r.published ? "Unpublish to draft" : "Publish to live"}
                            >
                              {r.published ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => openEditDialog(r)}
                              title="Edit Details"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(r.id)}
                              disabled={processingId === r.id}
                              title="Delete Resource"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[90vw]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-headline">
              {editingId ? "Edit Resource" : "Add Resource"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
            
            {/* LEFT COLUMN: Metadata */}
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-900">Categorization</h4>
                <p className="text-xs text-slate-500">Define where this resource lives.</p>
              </div>

              {/* Vertical */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Vertical</label>
                <Select
                  value={form.vertical}
                  onValueChange={(v) => setForm((p) => ({ ...p, vertical: v }))}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VERTICALS.map((v) => (
                      <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                    <SelectTrigger className="bg-slate-50 border-slate-200">
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
                  <label className="text-sm font-medium">Grade/Level</label>
                  <Select
                    value={form.grade}
                    onValueChange={(v) => setForm((p) => ({ ...p, grade: v }))}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADES.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Board + Curriculum */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Board / Domain</label>
                  <Input
                    value={form.board}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, board: e.target.value }))
                    }
                    placeholder="e.g. IB, CAIE, Engineering"
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Legacy Map</label>
                  <Input
                    value={form.curriculum}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, curriculum: e.target.value }))
                    }
                    placeholder="CBSE"
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={form.subject}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, subject: e.target.value }))
                  }
                  placeholder="Mathematics"
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Past Paper specific fields */}
              {form.type === ResourceType.PastPaper && (
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Year</label>
                    <Input
                      value={form.year}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, year: e.target.value }))
                      }
                      placeholder="2024"
                      className="bg-slate-50 border-slate-200"
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
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Content */}
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-900">Content & SEO</h4>
                <p className="text-xs text-slate-500">The actual resource material and display configuration.</p>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Title</label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g., Chapter 3: Pair of Linear Equations"
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Markdown Content */}
              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-sm font-medium">
                  Body{" "}
                  <span className="text-slate-400 font-normal">
                    (Markdown supported)
                  </span>
                </label>
                <Textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, content: e.target.value }))
                  }
                  rows={form.type === ResourceType.PastPaper ? 3 : 8}
                  placeholder={
                    form.type === ResourceType.FAQ
                      ? "The answer to the question..."
                      : form.type === ResourceType.Syllabus
                      ? "- Topic 1: ...\n- Topic 2: ..."
                      : "Write your content here..."
                  }
                  className="bg-slate-50 border-slate-200 resize-y flex-1"
                />
              </div>

              {/* File upload for past papers */}
              {form.type === ResourceType.PastPaper && (
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <label className="text-sm font-medium">Attached Document (PDF)</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 flex-1 rounded-lg border border-dashed border-slate-300 bg-slate-50 cursor-pointer hover:bg-slate-100 hover:border-emerald-300 transition-colors">
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-slate-600 truncate flex-1">
                        {file ? file.name : "Upload PDF Source..."}
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
                        className="h-9 w-9 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200"
                        onClick={() => setFile(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Tags + Sort + Published Footer Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4 mt-auto">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags (CSV)</label>
                  <Input
                    value={form.tags}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, tags: e.target.value }))
                    }
                    placeholder="algebra, revision"
                    className="bg-slate-50 border-slate-200 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort #</label>
                  <Input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        sortOrder: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="bg-slate-50 border-slate-200"
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
                    <SelectTrigger className="bg-slate-50 border-slate-200">
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
