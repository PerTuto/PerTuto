import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
    FolderTree,
    Plus,
    FileText,
    Calculator,
    ChevronRight,
    Sparkles,
    Save,
    Edit,
    Trash2,
    Check,
    Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    getCurricula,
    getSubjectsByCurriculum,
    getTopicsBySubject,
    getResourcesByTopic,
    createResource,
    updateResource,
    seedIBMYPMath
} from '@/services/content';
import type { Curriculum, Subject, Topic, Resource } from '@/types/content';

export const TopicsManager = () => {
    const { toast } = useToast();
    const [curricula, setCurricula] = useState<Curriculum[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // New resource form
    const [newResourceTitle, setNewResourceTitle] = useState('');
    const [newResourceContent, setNewResourceContent] = useState('');
    const [resourceType, setResourceType] = useState<'note' | 'formula_sheet'>('note');

    useEffect(() => {
        loadCurricula();
    }, []);

    useEffect(() => {
        if (selectedCurriculum) {
            loadSubjects(selectedCurriculum.id);
        }
    }, [selectedCurriculum]);

    useEffect(() => {
        if (selectedSubject && selectedCurriculum) {
            loadTopics(selectedSubject.id, selectedCurriculum.id);
        }
    }, [selectedSubject, selectedCurriculum]);

    useEffect(() => {
        if (selectedTopic) {
            loadResources(selectedTopic.id);
        }
    }, [selectedTopic]);

    const loadCurricula = async () => {
        setIsLoading(true);
        try {
            const data = await getCurricula();
            setCurricula(data);
            if (data.length > 0) {
                setSelectedCurriculum(data[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadSubjects = async (curriculumId: string) => {
        const data = await getSubjectsByCurriculum(curriculumId);
        setSubjects(data);
        if (data.length > 0) {
            setSelectedSubject(data[0]);
        } else {
            setSelectedSubject(null);
            setTopics([]);
        }
    };

    const loadTopics = async (subjectId: string, curriculumId: string) => {
        const data = await getTopicsBySubject(subjectId, curriculumId);
        setTopics(data);
        if (data.length > 0) {
            setSelectedTopic(data[0]);
        } else {
            setSelectedTopic(null);
        }
    };

    const loadResources = async (topicId: string) => {
        const data = await getResourcesByTopic(topicId);
        setResources(data);
    };

    const handleSeedData = async () => {
        setIsSeeding(true);
        try {
            await seedIBMYPMath();
            toast({
                title: 'Seed Complete',
                description: 'IB MYP Math structure has been created.',
            });
            loadCurricula();
        } catch (error) {
            toast({
                title: 'Seed Failed',
                description: String(error),
                variant: 'destructive'
            });
        } finally {
            setIsSeeding(false);
        }
    };

    const handleCreateResource = async (publish: boolean = false) => {
        if (!selectedTopic || !selectedSubject || !selectedCurriculum || !newResourceTitle) {
            toast({
                title: 'Missing Fields',
                description: 'Please select a topic and enter a title.',
                variant: 'destructive'
            });
            return;
        }

        setIsSaving(true);
        try {
            const slug = newResourceTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            await createResource({
                type: resourceType,
                title: newResourceTitle,
                slug,
                curriculumId: selectedCurriculum.id,
                subjectId: selectedSubject.id,
                topicId: selectedTopic.id,
                markdownContent: newResourceContent,
                tags: [selectedCurriculum.slug, selectedSubject.slug, selectedTopic.slug],
                isPublished: publish,
                isGated: false,
            });

            toast({
                title: publish ? 'Resource Published' : 'Draft Saved',
                description: publish
                    ? 'Your resource is now live on the website.'
                    : 'Your resource has been saved as a draft.',
            });

            setNewResourceTitle('');
            setNewResourceContent('');
            loadResources(selectedTopic.id);
        } catch (error) {
            toast({
                title: 'Error',
                description: String(error),
                variant: 'destructive'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublishResource = async (resourceId: string) => {
        try {
            await updateResource(resourceId, { isPublished: true });
            toast({
                title: 'Published',
                description: 'Resource is now live.',
            });
            if (selectedTopic) {
                loadResources(selectedTopic.id);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: String(error),
                variant: 'destructive'
            });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Topics Manager</h1>
                    <p className="text-muted-foreground">Organize topics and create educational content.</p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleSeedData}
                    disabled={isSeeding}
                    className={curricula.length === 0 ? 'animate-pulse border-primary' : ''}
                >
                    {isSeeding ? (
                        <>
                            <span className="animate-spin mr-2">⏳</span>
                            Seeding...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Seed IB MYP Math
                        </>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Navigation Tree */}
                <Card className="lg:col-span-1">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <FolderTree className="h-4 w-4" />
                            Content Tree
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-4 w-16 mt-4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : (
                            <>
                                {/* Curricula */}
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Curriculum</Label>
                                    {curricula.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => setSelectedCurriculum(c)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${selectedCurriculum?.id === c.id
                                                ? 'bg-primary/10 text-primary font-medium ring-1 ring-primary/20'
                                                : 'hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring'
                                                }`}
                                        >
                                            {c.name}
                                        </button>
                                    ))}
                                    {curricula.length === 0 && (
                                        <p className="text-sm text-muted-foreground py-2">
                                            No curricula yet. Click "Seed IB MYP Math" to start.
                                        </p>
                                    )}
                                </div>

                                {/* Subjects */}
                                {subjects.length > 0 && (
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Subject</Label>
                                        {subjects.map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => setSelectedSubject(s)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-200 ${selectedSubject?.id === s.id
                                                    ? 'bg-primary/10 text-primary font-medium ring-1 ring-primary/20'
                                                    : 'hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring'
                                                    }`}
                                            >
                                                <Calculator className="h-4 w-4" />
                                                {s.name}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Topics */}
                                {topics.length > 0 && (
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Topics</Label>
                                        {topics.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setSelectedTopic(t)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-200 ${selectedTopic?.id === t.id
                                                    ? 'bg-primary/10 text-primary font-medium ring-1 ring-primary/20'
                                                    : 'hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring'
                                                    }`}
                                            >
                                                <ChevronRight className={`h-4 w-4 transition-transform ${selectedTopic?.id === t.id ? 'rotate-90' : ''}`} />
                                                {t.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {selectedTopic ? (
                        <Tabs defaultValue="resources">
                            <TabsList>
                                <TabsTrigger value="resources">
                                    Resources ({resources.length})
                                </TabsTrigger>
                                <TabsTrigger value="create">
                                    <Plus className="mr-1 h-4 w-4" />
                                    Create New
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="resources" className="space-y-4 pt-4 animate-in fade-in duration-300">
                                {resources.length === 0 ? (
                                    <Card className="border-dashed border-2">
                                        <CardContent className="py-12 text-center text-muted-foreground">
                                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                            <p className="font-medium">No resources for "{selectedTopic.name}" yet.</p>
                                            <p className="text-sm mt-1">Click "Create New" to add notes or formula sheets.</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    resources.map(r => (
                                        <Card
                                            key={r.id}
                                            className="group hover:shadow-md transition-all duration-200 hover:border-primary/30"
                                        >
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-mono text-primary uppercase tracking-wider">
                                                                {r.type.replace('_', ' ')}
                                                            </span>
                                                            {r.isPublished ? (
                                                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 flex items-center gap-1">
                                                                    <Globe className="h-3 w-3" />
                                                                    Live
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600">
                                                                    Draft
                                                                </span>
                                                            )}
                                                        </div>
                                                        <CardTitle className="text-lg">{r.title}</CardTitle>
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {!r.isPublished && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                                onClick={() => handlePublishResource(r.id)}
                                                            >
                                                                <Check className="mr-1 h-4 w-4" />
                                                                Publish
                                                            </Button>
                                                        )}
                                                        <Button size="sm" variant="outline">
                                                            <Edit className="mr-1 h-4 w-4" />
                                                            Edit
                                                        </Button>
                                                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {r.markdownContent?.substring(0, 200)}...
                                                </p>
                                                <div className="flex gap-2 mt-3">
                                                    {r.tags.map(tag => (
                                                        <span key={tag} className="px-2 py-1 bg-muted rounded-md text-xs font-mono">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="create" className="pt-4 animate-in fade-in duration-300">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Create New Resource</CardTitle>
                                        <CardDescription>
                                            Add notes or formula sheets for "{selectedTopic.name}"
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex gap-3">
                                            <Button
                                                variant={resourceType === 'note' ? 'default' : 'outline'}
                                                onClick={() => setResourceType('note')}
                                                className="flex-1"
                                            >
                                                <FileText className="mr-2 h-4 w-4" />
                                                Note
                                            </Button>
                                            <Button
                                                variant={resourceType === 'formula_sheet' ? 'default' : 'outline'}
                                                onClick={() => setResourceType('formula_sheet')}
                                                className="flex-1"
                                            >
                                                <Calculator className="mr-2 h-4 w-4" />
                                                Formula Sheet
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                placeholder="e.g., Introduction to Algebra"
                                                value={newResourceTitle}
                                                onChange={(e) => setNewResourceTitle(e.target.value)}
                                                className="focus-visible:ring-primary"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="content">Content (Markdown + LaTeX)</Label>
                                            <Textarea
                                                id="content"
                                                className="min-h-[300px] font-mono text-sm resize-y focus-visible:ring-primary"
                                                placeholder={`# ${selectedTopic.name}\n\nWrite your notes here...\n\nUse LaTeX for math: $x^2 + y^2 = z^2$`}
                                                value={newResourceContent}
                                                onChange={(e) => setNewResourceContent(e.target.value)}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Supports Markdown and LaTeX. Use $...$ for inline math and $$...$$ for display math.
                                            </p>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleCreateResource(false)}
                                                disabled={isSaving || !newResourceTitle}
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                Save as Draft
                                            </Button>
                                            <Button
                                                onClick={() => handleCreateResource(true)}
                                                disabled={isSaving || !newResourceTitle}
                                                className="bg-gradient-to-r from-primary to-pink-600"
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <span className="animate-spin mr-2">⏳</span>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Globe className="mr-2 h-4 w-4" />
                                                        Publish Now
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    ) : (
                        <Card className="border-dashed border-2">
                            <CardContent className="py-16 text-center text-muted-foreground">
                                <FolderTree className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">Select a topic from the tree</p>
                                <p className="text-sm mt-1">Or seed the IB MYP Math structure to get started.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};
