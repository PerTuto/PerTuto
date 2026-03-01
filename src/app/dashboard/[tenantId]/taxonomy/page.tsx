
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  getTaxonomyNodes, 
  addTaxonomyNode, 
  updateTaxonomyNode, 
  deleteTaxonomyNode 
} from "../../../../lib/firebase/services/taxonomy";
import { TaxonomyNode } from "../../../../lib/types";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  Settings, 
  Trash2, 
  Edit, 
  Folder, 
  FileText,
  Save,
  X,
  Loader2,
  Database,
  Layers,
  Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function TaxonomyPage() {
  const { tenantId } = useParams() as { tenantId: string };
  const { toast } = useToast();
  
  const [nodes, setNodes] = useState<TaxonomyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [addingTo, setAddingTo] = useState<{ id: string | null, type: string } | null>(null);
  
  // Edit/Add Form State
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const fetchAllNodes = async () => {
    setLoading(true);
    try {
      // For simplicity, fetch all and build tree in memory, 
      // or fetch roots and then children on expand.
      // Let's do a basic recursive fetch for roots initially.
      const rootNodes = await getTaxonomyNodes(tenantId, null);
      setNodes(rootNodes);
    } catch (e) {
      toast({ title: "Error", description: "Failed to load taxonomy", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNodes();
  }, [tenantId]);

  const toggleExpand = async (nodeId: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
      // Fetch children if not already loaded (simplified here: we could check)
    }
    setExpanded(newExpanded);
  };

  const handleCreate = async () => {
    if (!formName || !addingTo) return;
    
    try {
      const newNode: Omit<TaxonomyNode, "id"> = {
        name: formName,
        description: formDesc,
        parentId: addingTo.id,
        type: addingTo.type as any,
        order: 0, // Placeholder
      };
      
      await addTaxonomyNode(tenantId, newNode);
      toast({ title: "Node Created", description: `${formName} added to taxonomy.` });
      setAddingTo(null);
      setFormName("");
      setFormDesc("");
      fetchAllNodes();
    } catch (e) {
      toast({ title: "Error", description: "Save failed", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete the node and potentially orphans children.")) return;
    try {
      await deleteTaxonomyNode(tenantId, id);
      toast({ title: "Deleted", description: "Taxonomy node removed." });
      fetchAllNodes();
    } catch (e) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "domain": return <Database className="w-4 h-4 text-blue-400" />;
      case "topic": return <Layers className="w-4 h-4 text-purple-400" />;
      case "subtopic": return <Folder className="w-4 h-4 text-amber-400" />;
      default: return <FileText className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getNextType = (currentType: string | null) => {
    if (!currentType) return "domain";
    if (currentType === "domain") return "topic";
    if (currentType === "topic") return "subtopic";
    return "microskill";
  };

  return (
    <div className="container mx-auto py-12 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/5">
        <div>
          <h1 className="text-4xl font-black font-outfit text-slate-900 dark:text-white mb-2">Curriculum Taxonomy</h1>
          <p className="text-muted-foreground font-medium">Define the hierarchical structure of your learning content for AI precision.</p>
        </div>
        <Button 
          className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white rounded-2xl h-12 px-8 shadow-xl shadow-teal-500/20 font-bold transition-all hover:-translate-y-0.5"
          onClick={() => setAddingTo({ id: null, type: "domain" })}
        >
          <Plus className="w-5 h-5 me-2" /> Add Main Domain
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl rounded-3xl">
          <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 py-6">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-500 dark:text-teal-400">
              <Layers className="w-4 h-4" /> Hierarchy Tree
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center space-y-6">
                <Loader2 className="w-10 h-10 animate-spin text-teal-600 dark:text-teal-400" />
                <p className="text-xs text-muted-foreground font-black tracking-widest uppercase">Initializing Knowledge Graph...</p>
              </div>
            ) : nodes.length === 0 ? (
              <div className="py-32 text-center">
                <p className="text-muted-foreground font-medium">No taxonomy defined yet. Start by adding a domain.</p>
              </div>
            ) : (
              <div className="p-6 space-y-2">
                {nodes.map(node => (
                  <div key={node.id} className="group">
                    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/5 shadow-sm hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-slate-400 hover:text-teal-600" onClick={() => toggleExpand(node.id)}>
                          {expanded.has(node.id) ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </Button>
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/80">
                          {getNodeIcon(node.type)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-bold text-slate-900 dark:text-white leading-none">{node.name}</span>
                          <span className="text-[10px] text-teal-600 dark:text-teal-400 uppercase font-black tracking-tighter mt-1">{node.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 text-slate-400 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/20"
                          onClick={() => setAddingTo({ id: node.id, type: getNextType(node.type) })}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                          onClick={() => handleDelete(node.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-8">
          {addingTo && (
            <Card className="bg-white dark:bg-slate-900 border-2 border-teal-500/30 shadow-2xl rounded-3xl animate-in slide-in-from-right-8 duration-500 overflow-hidden">
              <CardHeader className="bg-teal-500/5 pb-6">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center justify-between text-teal-700 dark:text-teal-400">
                  <span>Add {addingTo.type}</span>
                  <X className="w-5 h-5 cursor-pointer text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" onClick={() => setAddingTo(null)} />
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500">
                  {addingTo.id ? "Creating a specialized branch in your curriculum tree." : "Defining a new foundational content domain."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-[11px] uppercase font-black text-slate-500 tracking-wider pl-1">Display Name</Label>
                  <Input 
                    placeholder="e.g. Calculus, Algebra..." 
                    className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-12 rounded-xl focus:ring-4 focus:ring-teal-500/10 transition-all text-slate-900 dark:text-white"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] uppercase font-black text-slate-500 tracking-wider pl-1">Description (Optional)</Label>
                  <Input 
                    placeholder="Brief objective..." 
                    className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-12 rounded-xl focus:ring-4 focus:ring-teal-500/10 transition-all text-slate-900 dark:text-white"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                  />
                </div>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black h-12 rounded-xl shadow-lg shadow-teal-500/20 transition-all" onClick={handleCreate}>
                  <Save className="w-4 h-4 me-2" /> Save Node
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="bg-amber-500/5 border-amber-500/20 shadow-xl rounded-3xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-amber-600 dark:text-amber-500">
                <Settings className="w-4 h-4" /> Management Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm font-medium text-amber-900/70 dark:text-amber-400/70 leading-relaxed pt-2">
              <p>Keep your taxonomy consistent to ensure AI extraction and curation work with high accuracy.</p>
              <p>We recommend a 4-level structure: Domain → Topic → Subtopic → Microskill.</p>
              <Button variant="outline" className="w-full h-11 border-amber-500/20 hover:bg-amber-500/10 text-[11px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-500 rounded-xl transition-all">
                <Sparkles className="w-4 h-4 me-2" /> AI Auto-Structure
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
