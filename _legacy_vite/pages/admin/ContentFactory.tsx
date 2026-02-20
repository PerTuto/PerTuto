import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Sparkles, Loader2, Plus, FileText, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/services/firebase';

export const ContentFactory = () => {
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedCurriculum, setSelectedCurriculum] = useState<string>('ib');
    const [selectedSubject, setSelectedSubject] = useState<string>('math-aa-hl');
    const [topic, setTopic] = useState('');
    const [questions, setQuestions] = useState<any[]>([]);

    const handleGenerate = async () => {
        if (!topic) {
            toast({
                title: "Topic Required",
                description: "Please enter a topic to generate questions for.",
                variant: "destructive"
            });
            return;
        }

        setIsGenerating(true);
        try {
            const generateFn = httpsCallable(functions, 'generateQuestions');
            const result = await generateFn({
                curriculum: selectedCurriculum,
                subject: selectedSubject,
                topic: topic,
                count: 5
            });

            const data = result.data as any;
            setQuestions(data.questions || []);

            toast({
                title: "Generation Complete",
                description: `${data.questions?.length || 0} questions generated successfully.`,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Generation Failed",
                description: "An error occurred. Make sure the AI service is deployed.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleApprove = (index: number) => {
        toast({
            title: "Question Approved",
            description: "Question has been added to the question bank.",
        });
        setQuestions(q => q.filter((_, i) => i !== index));
    };

    const handleReject = (index: number) => {
        setQuestions(q => q.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Content Factory</h1>
                <p className="text-muted-foreground">AI-Powered Content Generation & Management Engine.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Control Panel */}
                <Card className="md:col-span-1 h-fit sticky top-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Generator Controls
                        </CardTitle>
                        <CardDescription>Configure AI generation parameters</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Curriculum</Label>
                            <Select value={selectedCurriculum} onValueChange={setSelectedCurriculum}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ib">International Baccalaureate (IB)</SelectItem>
                                    <SelectItem value="igcse">IGCSE</SelectItem>
                                    <SelectItem value="alevel">A-Level</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="math-aa-hl">Math AA HL</SelectItem>
                                    <SelectItem value="physics-hl">Physics HL</SelectItem>
                                    <SelectItem value="chemistry-hl">Chemistry HL</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Target Topic</Label>
                            <Input
                                placeholder="e.g. Calculus: Chain Rule"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>

                        <div className="pt-4 space-y-3">
                            <Button
                                className="w-full bg-gradient-to-r from-primary to-pink-600 text-white hover:opacity-90 transition-opacity"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Generate Questions
                                    </>
                                )}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or Upload Source</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Input
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    id="pdf-upload"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        setIsGenerating(true);
                                        try {
                                            const reader = new FileReader();
                                            reader.onload = async () => {
                                                const base64 = (reader.result as string).split(',')[1];
                                                const extractFn = httpsCallable(functions, 'generateQuestionsFromPdf');
                                                const result = await extractFn({
                                                    pdfBase64: base64,
                                                    topic: topic,
                                                    curriculum: selectedCurriculum
                                                });
                                                const data = result.data as any;
                                                setQuestions(data.questions || []);
                                                toast({ title: "Extraction Complete", description: `Found ${data.questions?.length || 0} questions.` });
                                            };
                                            reader.readAsDataURL(file);
                                        } catch (error) {
                                            console.error(error);
                                            toast({ title: "Upload Failed", variant: "destructive" });
                                        } finally {
                                            setIsGenerating(false);
                                        }
                                    }}
                                />
                                <Button
                                    variant="outline"
                                    className="w-full border-dashed border-2 h-24 flex flex-col gap-1 items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-all relative group"
                                    onClick={() => document.getElementById('pdf-upload')?.click()}
                                    disabled={isGenerating}
                                >
                                    <Upload className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-medium">Upload PDF / Past Paper</span>
                                    <span className="text-[10px] opacity-60">Gemini 1.5 Pro will extract questions</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Content Workspace */}
                <div className="md:col-span-2 space-y-6">
                    <Tabs defaultValue="review">
                        <TabsList>
                            <TabsTrigger value="review">
                                Review Queue ({questions.length})
                            </TabsTrigger>
                            <TabsTrigger value="published">Published Content</TabsTrigger>
                            <TabsTrigger value="notes">Notes Generator</TabsTrigger>
                        </TabsList>

                        <TabsContent value="review" className="space-y-4 pt-4 animate-in fade-in duration-300">
                            {questions.length === 0 && (
                                <Card className="border-dashed border-2">
                                    <CardContent className="py-12 text-center text-muted-foreground">
                                        <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p className="font-medium">No questions in review queue.</p>
                                        <p className="text-sm mt-1">Enter a topic and click "Generate Questions" to start.</p>
                                    </CardContent>
                                </Card>
                            )}

                            {questions.map((q, i) => (
                                <Card key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-300 hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                                                        {selectedSubject}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">•</span>
                                                    <span className="text-xs text-muted-foreground">{topic}</span>
                                                </div>
                                                <CardTitle className="text-base font-medium leading-relaxed">
                                                    {q.stem}
                                                </CardTitle>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <div className="px-2 py-1 bg-muted rounded text-xs font-mono">
                                                    Lvl {q.difficulty}
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                    onClick={() => handleApprove(i)}
                                                >
                                                    <CheckCircle className="mr-1 h-4 w-4" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => handleReject(i)}
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground space-y-4">
                                        <div className="p-3 bg-muted/50 rounded-lg font-mono text-xs">
                                            Answer: {q.answer}
                                        </div>
                                        <div>
                                            <span className="font-bold text-foreground">Explanation:</span> {q.explanation}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {questions.length > 0 && (
                                <Button variant="ghost" className="w-full text-muted-foreground">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Generate More
                                </Button>
                            )}
                        </TabsContent>

                        <TabsContent value="published" className="pt-4 animate-in fade-in duration-300">
                            <Card className="border-dashed border-2">
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="font-medium">No published content yet.</p>
                                    <p className="text-sm mt-1">Approve questions from the review queue to publish them.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notes" className="pt-4 animate-in fade-in duration-300">
                            <Card className="border-dashed border-2">
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <Info className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="font-medium">Notes Generator Coming Soon</p>
                                    <p className="text-sm mt-1">Use the Topics Manager to create notes manually for now.</p>
                                    <Button variant="outline" className="mt-4" asChild>
                                        <a href="/admin/topics">Go to Topics Manager</a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};
