import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    BookOpen,
    FileText,
    Calculator,
    ChevronRight,
    Sparkles,
    Lock,
    GraduationCap,
    Atom,
    Globe
} from 'lucide-react';
import {
    getCurriculumBySlug,
    getSubjectsByCurriculum,
    getTopicsBySubject,
    getResourcesByTopic,
    getCurricula
} from '@/services/content';
import type { Curriculum, Subject, Topic, Resource } from '@/types/content';

export const ResourcesPage = () => {
    const { curriculum, subject, topic } = useParams();
    const [allCurricula, setAllCurricula] = useState<Curriculum[]>([]);
    const [curriculumData, setCurriculumData] = useState<Curriculum | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (curriculum) {
            loadCurriculum(curriculum);
        } else {
            loadAllCurricula();
        }
    }, [curriculum]);

    useEffect(() => {
        if (subject && curriculumData) {
            const sub = subjects.find(s => s.slug === subject);
            if (sub) {
                setSelectedSubject(sub);
                loadTopics(sub.id, curriculumData.id);
            }
        }
    }, [subject, subjects, curriculumData]);

    useEffect(() => {
        if (topic && selectedSubject) {
            const t = topics.find(tp => tp.slug === topic);
            if (t) {
                setSelectedTopic(t);
                loadResources(t.id);
            }
        }
    }, [topic, topics, selectedSubject]);

    const loadAllCurricula = async () => {
        setIsLoading(true);
        try {
            const data = await getCurricula();
            setAllCurricula(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCurriculum = async (slug: string) => {
        setIsLoading(true);
        const data = await getCurriculumBySlug(slug);
        setCurriculumData(data);
        if (data) {
            const subs = await getSubjectsByCurriculum(data.id);
            setSubjects(subs);
        }
        setIsLoading(false);
    };

    const loadTopics = async (subjectId: string, curriculumId: string) => {
        const data = await getTopicsBySubject(subjectId, curriculumId);
        setTopics(data);
    };

    const loadResources = async (topicId: string) => {
        const data = await getResourcesByTopic(topicId);
        setResources(data);
    };

    // SEO Meta
    const pageTitle = selectedTopic
        ? `${selectedTopic.name} - ${selectedSubject?.name} | PerTuto`
        : selectedSubject
            ? `${selectedSubject.name} Resources | PerTuto`
            : curriculumData
                ? `${curriculumData.name} Resources | PerTuto`
                : 'Free Study Resources | PerTuto';

    const pageDescription = selectedTopic
        ? `Free notes, formulas, and practice questions for ${selectedTopic.name} in ${selectedSubject?.name}.`
        : `Free educational resources for ${curriculumData?.name || 'IB, IGCSE, and CBSE'} students.`;

    // Loading Skeleton
    const LoadingSkeleton = () => (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
                <Card key={i}>
                    <CardHeader className="text-center py-8">
                        <Skeleton className="h-16 w-16 rounded-2xl mx-auto mb-4" />
                        <Skeleton className="h-6 w-32 mx-auto mb-2" />
                        <Skeleton className="h-4 w-48 mx-auto" />
                    </CardHeader>
                </Card>
            ))}
        </div>
    );

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-4 py-12">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                        <Link to="/resources" className="hover:text-foreground transition-colors">
                            Resources
                        </Link>
                        {curriculumData && (
                            <>
                                <ChevronRight className="h-4 w-4" />
                                <Link
                                    to={`/resources/${curriculumData.slug}`}
                                    className="hover:text-foreground transition-colors"
                                >
                                    {curriculumData.name}
                                </Link>
                            </>
                        )}
                        {selectedSubject && (
                            <>
                                <ChevronRight className="h-4 w-4" />
                                <Link
                                    to={`/resources/${curriculum}/${selectedSubject.slug}`}
                                    className="hover:text-foreground transition-colors"
                                >
                                    {selectedSubject.name}
                                </Link>
                            </>
                        )}
                        {selectedTopic && (
                            <>
                                <ChevronRight className="h-4 w-4" />
                                <span className="text-foreground font-medium">{selectedTopic.name}</span>
                            </>
                        )}
                    </nav>

                    {/* Page Header */}
                    <header className="mb-12">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">
                            {selectedTopic?.name || selectedSubject?.name || curriculumData?.name || 'Study Resources'}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            {selectedTopic
                                ? `Free notes, formula sheets, and practice questions.`
                                : `Explore our free educational resources designed to help you succeed.`
                            }
                        </p>
                    </header>

                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : selectedTopic ? (
                        /* Topic View - Show Resources */
                        <div className="space-y-6">
                            {resources.length === 0 ? (
                                <Card className="border-dashed border-2">
                                    <CardContent className="py-16 text-center">
                                        <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                        <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                                        <p className="text-muted-foreground mb-6">
                                            We're adding resources for {selectedTopic.name}. Check back soon!
                                        </p>
                                        <Button variant="outline" asChild>
                                            <Link to={`/resources/${curriculum}/${subject}`}>
                                                Browse Other Topics
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2">
                                    {resources.map(resource => (
                                        <Card
                                            key={resource.id}
                                            className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 hover:-translate-y-1"
                                        >
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {resource.type === 'note' && (
                                                            <div className="p-2 rounded-lg bg-blue-500/10">
                                                                <FileText className="h-5 w-5 text-blue-500" />
                                                            </div>
                                                        )}
                                                        {resource.type === 'formula_sheet' && (
                                                            <div className="p-2 rounded-lg bg-green-500/10">
                                                                <Calculator className="h-5 w-5 text-green-500" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                                                                {resource.type.replace('_', ' ')}
                                                            </div>
                                                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                                                {resource.title}
                                                            </CardTitle>
                                                        </div>
                                                    </div>
                                                    {resource.isGated && (
                                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                                    {resource.description || resource.markdownContent?.substring(0, 150)}...
                                                </p>
                                                <Button className="w-full" variant="outline" asChild>
                                                    <Link to={`/resources/${curriculum}/${subject}/${topic}/${resource.slug}`}>
                                                        View Resource
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {/* AI CTA */}
                            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 overflow-hidden relative">
                                <div className="absolute inset-0 bg-grid-white/5" />
                                <CardContent className="py-8 text-center relative">
                                    <Sparkles className="h-8 w-8 mx-auto mb-4 text-purple-500" />
                                    <h3 className="text-xl font-semibold mb-2">Need help with a specific question?</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Our AI tutor can explain any concept step-by-step.
                                    </p>
                                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90">
                                        Ask AI Tutor
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    ) : selectedSubject ? (
                        /* Subject View - Show Topics */
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {topics.length === 0 ? (
                                <Card className="col-span-full border-dashed border-2">
                                    <CardContent className="py-16 text-center text-muted-foreground">
                                        <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                        <p className="font-medium">No topics available yet.</p>
                                        <p className="text-sm mt-1">Check back soon for content updates.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                topics.map(t => (
                                    <Link
                                        key={t.id}
                                        to={`/resources/${curriculum}/${subject}/${t.slug}`}
                                        className="group"
                                    >
                                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
                                            <CardHeader>
                                                <CardTitle className="flex items-center justify-between">
                                                    <span className="group-hover:text-primary transition-colors">
                                                        {t.name}
                                                    </span>
                                                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                </CardTitle>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                ))
                            )}
                        </div>
                    ) : curriculumData ? (
                        /* Curriculum View - Show Subjects */
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {subjects.length === 0 ? (
                                <Card className="col-span-full border-dashed border-2">
                                    <CardContent className="py-16 text-center text-muted-foreground">
                                        <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                        <p className="font-medium">No subjects available yet.</p>
                                        <p className="text-sm mt-1">Content is being prepared. Check back soon!</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                subjects.map(s => (
                                    <Link
                                        key={s.id}
                                        to={`/resources/${curriculum}/${s.slug}`}
                                        className="group"
                                    >
                                        <Card className="h-full hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
                                            <CardHeader>
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                        <Calculator className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="group-hover:text-primary transition-colors">
                                                            {s.name}
                                                        </CardTitle>
                                                        <p className="text-sm text-muted-foreground">
                                                            {s.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                ))
                            )}
                        </div>
                    ) : (
                        /* Root View - Show Curricula (dynamic + hardcoded coming soon) */
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Dynamic curricula from database */}
                            {allCurricula.map(c => (
                                <Link key={c.id} to={`/resources/${c.slug}`} className="group">
                                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
                                        <CardHeader className="text-center py-8">
                                            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 w-fit mx-auto mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                <GraduationCap className="h-8 w-8" />
                                            </div>
                                            <CardTitle className="text-2xl group-hover:text-blue-500 transition-colors">
                                                {c.name.replace('IB Middle Years Programme', 'IB MYP')}
                                            </CardTitle>
                                            <p className="text-muted-foreground">
                                                {c.description}
                                            </p>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            ))}

                            {/* If no curricula in DB, show the hardcoded IB MYP */}
                            {allCurricula.length === 0 && (
                                <Link to="/resources/ib-myp" className="group">
                                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
                                        <CardHeader className="text-center py-8">
                                            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 w-fit mx-auto mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                <GraduationCap className="h-8 w-8" />
                                            </div>
                                            <CardTitle className="text-2xl group-hover:text-blue-500 transition-colors">
                                                IB MYP
                                            </CardTitle>
                                            <p className="text-muted-foreground">
                                                Middle Years Programme (Ages 11-16)
                                            </p>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            )}

                            {/* Coming Soon Cards */}
                            <Card className="h-full border-dashed opacity-60 hover:opacity-80 transition-opacity">
                                <CardHeader className="text-center py-8">
                                    <div className="p-4 rounded-2xl bg-muted w-fit mx-auto mb-4">
                                        <Atom className="h-8 w-8" />
                                    </div>
                                    <CardTitle className="text-2xl">IB DP</CardTitle>
                                    <p className="text-muted-foreground">Coming Soon</p>
                                </CardHeader>
                            </Card>

                            <Card className="h-full border-dashed opacity-60 hover:opacity-80 transition-opacity">
                                <CardHeader className="text-center py-8">
                                    <div className="p-4 rounded-2xl bg-muted w-fit mx-auto mb-4">
                                        <Globe className="h-8 w-8" />
                                    </div>
                                    <CardTitle className="text-2xl">IGCSE</CardTitle>
                                    <p className="text-muted-foreground">Coming Soon</p>
                                </CardHeader>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
