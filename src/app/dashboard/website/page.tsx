"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getWebsiteContent, saveWebsiteContent } from "@/lib/firebase/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Save, Globe } from "lucide-react";
import type { WebsiteContent, UserRole } from "@/lib/types";

const PAGES = [
  { id: "home_page", label: "Home Page" },
  { id: "services_k12", label: "K-12 Services" },
  { id: "services_higher_ed", label: "Higher Ed Services" },
  { id: "services_professional", label: "Professional Services" },
  { id: "about_page", label: "About Us" },
];

export default function WebsiteCMSPage() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [activePage, setActivePage] = useState<string>("home_page");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<Partial<WebsiteContent>>({});

  const isSuper = userProfile?.role === "super" || (Array.isArray(userProfile?.role) && userProfile.role.includes("super" as UserRole));

  useEffect(() => {
    if (isSuper) {
      fetchContent(activePage);
    }
  }, [activePage, isSuper]);

  async function fetchContent(pageId: string) {
    setLoading(true);
    try {
      const data = await getWebsiteContent(pageId);
      if (data) {
        setContent(data);
      } else {
        // Hydrate blank template if doesn't exist yet
        setContent({
          id: pageId,
          hero: { title: "", subtitle: "" },
          features: [],
          seoTitle: "",
          seoDescription: ""
        });
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to load content", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!content.id) return;
    setSaving(true);
    try {
      await saveWebsiteContent(content.id, {
        ...content,
        updatedBy: userProfile?.email || "unknown"
      });
      toast({ title: "Saved", description: "Website content published live." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to save content", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function updateHero(field: string, value: string) {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value } as any
    }));
  }

  function addFeature() {
    setContent(prev => ({
      ...prev,
      features: [...(prev.features || []), { id: crypto.randomUUID(), title: "", description: "", iconName: "" }]
    }));
  }

  function updateFeature(index: number, field: string, value: string) {
    setContent(prev => {
      const newFeatures = [...(prev.features || [])];
      newFeatures[index] = { ...newFeatures[index], [field]: value };
      return { ...prev, features: newFeatures };
    });
  }

  function removeFeature(index: number) {
    setContent(prev => {
      const newFeatures = [...(prev.features || [])];
      newFeatures.splice(index, 1);
      return { ...prev, features: newFeatures };
    });
  }

  if (!isSuper) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Globe className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold font-headline mb-2 text-slate-900">Access Restricted</h2>
        <p className="text-slate-500">Only Super Admins can edit public website content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Website CMS</h1>
          <p className="text-muted-foreground mt-1">Manage public landing pages, hero copy, and SEO metadata natively.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={activePage} onValueChange={setActivePage}>
            <SelectTrigger className="w-[220px] bg-white">
              <SelectValue placeholder="Select Page" />
            </SelectTrigger>
            <SelectContent>
              {PAGES.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSave} disabled={loading || saving} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px] shadow-sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Publishing..." : "Publish Edits"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-24"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg">Hero Section ({PAGES.find(p => p.id === activePage)?.label})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6 bg-white">
                <div className="space-y-2">
                  <Label className="text-slate-600">Badge Text (Optional)</Label>
                  <Input value={content.hero?.badgeText || ""} onChange={e => updateHero("badgeText", e.target.value)} placeholder="e.g. #1 Ranked AI Tutor" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600">Main Title (H1)</Label>
                  <Input value={content.hero?.title || ""} onChange={e => updateHero("title", e.target.value)} placeholder="Empowering Students Globally" className="font-semibold text-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600">Subtitle</Label>
                  <Textarea value={content.hero?.subtitle || ""} onChange={e => updateHero("subtitle", e.target.value)} placeholder="A short descriptive paragraph explaining the core value..." className="h-28 text-base" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-600">Primary CTA Text</Label>
                    <Input value={content.hero?.primaryCtaText || ""} onChange={e => updateHero("primaryCtaText", e.target.value)} placeholder="Start Learning" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600">Primary CTA Link</Label>
                    <Input value={content.hero?.primaryCtaLink || ""} onChange={e => updateHero("primaryCtaLink", e.target.value)} placeholder="/dashboard" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-600">Secondary CTA Text</Label>
                    <Input value={content.hero?.secondaryCtaText || ""} onChange={e => updateHero("secondaryCtaText", e.target.value)} placeholder="View Pricing" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600">Secondary CTA Link</Label>
                    <Input value={content.hero?.secondaryCtaLink || ""} onChange={e => updateHero("secondaryCtaLink", e.target.value)} placeholder="/pricing" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Feature Blocks</CardTitle>
                <Button variant="outline" size="sm" onClick={addFeature} className="gap-2 h-8">
                  <Plus className="w-3 h-3" /> Add Feature
                </Button>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 bg-slate-50/50">
                {!content.features?.length && (
                  <div className="text-center text-muted-foreground py-8 text-sm italic">No reusable feature blocks added to this page yet.</div>
                )}
                {content.features?.map((feat, idx) => (
                  <div key={feat.id || idx} className="p-5 border border-slate-200 rounded-xl relative bg-white shadow-sm">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-3 end-3 h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeFeature(idx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="space-y-4 pe-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Feature Title</Label>
                          <Input value={feat.title} onChange={e => updateFeature(idx, "title", e.target.value)} placeholder="e.g. AI Grading" />
                        </div>
                        <div className="space-y-2">
                          <Label>Lucide Icon</Label>
                          <Input value={feat.iconName || ""} onChange={e => updateFeature(idx, "iconName", e.target.value)} placeholder="e.g. BrainCircuit, Rocket" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Short Description</Label>
                        <Textarea value={feat.description} onChange={e => updateFeature(idx, "description", e.target.value)} className="h-24 resize-none" placeholder="Explain the feature..." />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-violet-50 border-b border-violet-100 pb-4">
                <CardTitle className="text-lg text-violet-900">Search Engine Settings (SEO)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6 bg-white">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input 
                    value={content.seoTitle || ""} 
                    onChange={e => setContent(prev => ({ ...prev, seoTitle: e.target.value }))} 
                    placeholder="Page Title | PerTuto"
                  />
                  <p className="text-xs text-muted-foreground">Appears in browser tabs and Google Search links.</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea 
                    value={content.seoDescription || ""} 
                    onChange={e => setContent(prev => ({ ...prev, seoDescription: e.target.value }))} 
                    placeholder="Brief summary for search engines..."
                    className="h-32"
                  />
                  <p className="text-xs text-muted-foreground">Keep under 160 characters for best click-through rates.</p>
                </div>
              </CardContent>
            </Card>
            
            {content.updatedAt && (
              <div className="px-4 py-3 bg-slate-50 rounded-lg text-sm text-slate-500 text-center border border-slate-200">
                <p className="font-medium text-slate-700">Last published:</p>
                <p>{new Date(content.updatedAt).toLocaleString()}</p>
                <p className="text-xs mt-1">by {content.updatedBy}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
