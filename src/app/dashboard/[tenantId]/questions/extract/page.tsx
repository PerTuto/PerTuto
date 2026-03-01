
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  BrainCircuit,
  Zap
} from "lucide-react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase/client-app";
import ExtractionQueue from "@/components/question-bank/ExtractionQueue";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function ExtractorPage() {
  const { tenantId } = useParams() as { tenantId: string };
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [curriculum, setCurriculum] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const startExtraction = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      // 1. Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const pdfBase64 = await base64Promise;

      // 2. Call worksheetExtractor cloud function
      const worksheetExtractor = httpsCallable<any, any>(functions, "worksheetExtractor");
      const result = await worksheetExtractor({
        tenantId,
        pdfBase64,
        curriculum,
      });

      if (result.data) {
        setExtractedData(result.data);
        toast({
          title: "Extraction Complete",
          description: `Successfully extracted ${result.data.questions?.length} questions`,
        });
      }
    } catch (error) {
      console.error("Extraction failed:", error);
      toast({
        title: "Error",
        description: "AI Extraction failed. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (extractedData) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black font-outfit text-slate-900 dark:text-white mb-2">Review Extraction</h1>
            <p className="text-muted-foreground">Review and refine AI-extracted questions before publishing.</p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
            <Zap className="w-3 h-3 me-2" /> Powered by Gemini 2.0 Flash
          </Badge>
        </div>

        <ExtractionQueue
          questions={extractedData.questions || []}
          pdfUrl={extractedData.pdfUrl}
          onDone={() => setExtractedData(null)}
          onCancel={() => setExtractedData(null)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 max-w-4xl animate-in font-display">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-teal-500/10 mb-8 border border-teal-500/20 shadow-xl shadow-teal-500/5 rotate-3 hover:rotate-0 transition-transform cursor-pointer group">
          <BrainCircuit className="w-10 h-10 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
        </div>
        <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-6">AI Worksheet Extractor</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Upload any PDF worksheet. PerTuto AI will automatically identify questions, extract diagrams, and tag them with appropriate taxonomy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl">
          <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 pb-6">
            <CardTitle className="text-xl font-bold font-outfit text-slate-900 dark:text-white">Upload Document</CardTitle>
            <CardDescription className="text-muted-foreground">Only PDF format is supported for accurate AI vision analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            <div 
              className={`relative border-2 border-dashed rounded-3xl p-16 text-center transition-all cursor-pointer group ${
                file ? "border-teal-500/50 bg-teal-500/5" : "border-slate-200 dark:border-white/10 hover:border-teal-500/30 hover:bg-slate-50 dark:hover:bg-white/5"
              }`}
            >
              <Input 
                type="file" 
                accept=".pdf" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                onChange={handleFileChange}
              />
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 mb-2 group-hover:scale-110 transition-transform border border-slate-200 dark:border-white/10">
                  <Upload className={`w-8 h-8 ${file ? "text-teal-600" : "text-slate-400 dark:text-white/20"}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {file ? file.name : "Click or drag PDF to upload"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Max file size 20MB • PDF Only
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-3">
                <Label className="text-[11px] uppercase font-black text-teal-600 dark:text-teal-400 tracking-widest pl-1">Target Curriculum (Optional)</Label>
                <Input 
                  placeholder="e.g. CBSE Grade 10 Math" 
                  className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-12 rounded-2xl focus:ring-2 focus:ring-teal-500/20 text-slate-900 dark:text-white"
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value)}
                />
              </div>
            </div>

            <Button 
              className="w-full h-14 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white font-black text-lg rounded-2xl shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5"
              disabled={!file || isProcessing}
              onClick={startExtraction}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 me-3 animate-spin" />
                  Processing with Gemini Pro Vision...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 me-3" />
                  Start AI Extraction
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border-slate-200 dark:border-white/5 shadow-xl">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-white/5">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-slate-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5 text-sm">
              {[
                "Automatic Question Identification",
                "LaTeX & Math Symbols Detection",
                "Diagram & Figure Extraction",
                "Curriculum & Level Tagging"
              ].map((feat, i) => (
                <div key={i} className="flex gap-3 items-center text-slate-600 dark:text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                  <p className="font-medium">{feat}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-amber-500/5 border-amber-500/20 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-amber-600 dark:text-amber-500">
                <AlertCircle className="w-4 h-4" /> Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed font-medium">
              Use high-quality PDFs without handwritten notes for the highest extraction accuracy. Multi-column layouts are supported.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
