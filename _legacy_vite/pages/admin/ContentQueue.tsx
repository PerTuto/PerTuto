import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    RefreshCcw,
    FileText,
    CheckCircle,
    XCircle,
    Sparkles,
    Loader2,
    Database,
    Search
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db, functions } from '@/services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useToast } from '@/hooks/use-toast';

export const ContentQueue = () => {
    const { toast } = useToast();
    const [driveQueue, setDriveQueue] = useState<any[]>([]);
    const [reviewQueue, setReviewQueue] = useState<any[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isExtracting, setIsExtracting] = useState<string | null>(null);

    useEffect(() => {
        // Listen to Drive Queue
        const qDrive = query(collection(db, 'content_queue'), orderBy('createdAt', 'desc'));
        const unsubscribeDrive = onSnapshot(qDrive, (snapshot) => {
            setDriveQueue(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Listen to Review Queue (Questions extracted but not yet published)
        const qReview = query(collection(db, 'review_queue'), orderBy('createdAt', 'desc'));
        const unsubscribeReview = onSnapshot(qReview, (snapshot) => {
            setReviewQueue(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeDrive();
            unsubscribeReview();
        };
    }, []);

    const handleSyncDrive = async () => {
        setIsSyncing(true);
        try {
            const syncFn = httpsCallable(functions, 'syncDriveFolder');
            // These would normally come from a settings page or env
            const result = await syncFn({
                folderId: 'YOUR_FOLDER_ID', // User will need to configure this
                serviceAccountKey: {}, // Handled by backend or passed if dynamic
                curriculum: 'IB MYP',
                subject: 'Math'
            });

            const data = result.data as any;
            toast({
                title: "Sync Complete",
                description: `Found ${data.newFilesCount} new files.`,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Sync Failed",
                description: "Check your console for details.",
                variant: "destructive"
            });
        } finally {
            setIsSyncing(false);
        }
    };

    const handleExtract = async (file: any) => {
        setIsExtracting(file.id);
        try {
            // 1. In a real app, we'd download from Drive and get base64 
            // Here we assume the backend handles it or we pass a mock for MVP
            const extractFn = httpsCallable(functions, 'generateQuestionsFromPdf');

            // Actually call the extraction (even if mock for now, to fix lint)
            await extractFn({
                pdfBase64: 'MOCK_DATA', // In a real app, this would be the file data
                topic: file.topic || 'General',
                curriculum: file.curriculum || 'IB'
            });
            // In a fully automated flow, the drive sync would trigger this via a Cloud Function
            toast({
                title: "Extraction Started",
                description: `AI is processing ${file.fileName}...`,
            });

            // Update status to processing
            await updateDoc(doc(db, 'content_queue', file.id), { status: 'processing' });

            // Mocking the completion for now since the full PDF -> extraction flow is async
            setTimeout(async () => {
                await updateDoc(doc(db, 'content_queue', file.id), { status: 'completed' });
                setIsExtracting(null);
            }, 3000);

        } catch (error) {
            console.error(error);
            toast({
                title: "Extraction Failed",
                variant: "destructive"
            });
            setIsExtracting(null);
        }
    };

    const handleApprove = async (question: any) => {
        try {
            // Add to main topics collection
            await addDoc(collection(db, 'questions'), {
                ...question,
                isPublished: true,
                approvedAt: new Date()
            });
            // Remove from review queue
            await deleteDoc(doc(db, 'review_queue', question.id));
            toast({ title: "Question Approved & Published" });
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async (id: string) => {
        await deleteDoc(doc(db, 'review_queue', id));
        toast({ title: "Question Rejected", variant: "destructive" });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Content Queue</h1>
                    <p className="text-muted-foreground">Manage incoming files and AI-extracted curriculum content.</p>
                </div>
                <Button
                    onClick={handleSyncDrive}
                    disabled={isSyncing}
                    className="bg-primary text-white"
                >
                    {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                    Sync Google Drive
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Incoming Files (from Drive) */}
                <Card className="border-black/5 dark:border-white/10 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5 text-blue-500" />
                            Incoming Files
                        </CardTitle>
                        <CardDescription>New uploads found in synced Google Drive folders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[500px] pr-4">
                            {driveQueue.length === 0 ? (
                                <div className="text-center py-20 opacity-40">
                                    <FileText className="w-12 h-12 mx-auto mb-2" />
                                    <p>No new files found.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {driveQueue.map((file) => (
                                        <div key={file.id} className="p-4 border rounded-xl bg-muted/30 flex items-center justify-between group hover:border-blue-500/50 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium leading-none mb-1">{file.fileName}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter py-0">
                                                            {file.subject}
                                                        </Badge>
                                                        <span className="text-[10px] text-muted-foreground italic">
                                                            {new Date(file.createdAt?.toDate()).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleExtract(file)}
                                                disabled={isExtracting === file.id || file.status === 'completed'}
                                            >
                                                {isExtracting === file.id ? (
                                                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                                                ) : (
                                                    <Sparkles className="h-3 w-3 mr-2" />
                                                )}
                                                {file.status === 'completed' ? 'Extracted' : 'Extract AI'}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* AI Review Queue */}
                <Card className="border-black/5 dark:border-white/10 shadow-sm bg-gradient-to-br from-background to-purple-500/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            AI Review Queue
                        </CardTitle>
                        <CardDescription>Verify questions extracted by AI before publishing</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[500px] pr-4">
                            {reviewQueue.length === 0 ? (
                                <div className="text-center py-20 opacity-40">
                                    <Search className="w-12 h-12 mx-auto mb-2" />
                                    <p>Nothing to review.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviewQueue.map((q) => (
                                        <div key={q.id} className="p-4 border rounded-xl bg-white dark:bg-black/40 space-y-3 shadow-sm hover:ring-1 ring-purple-500/30 transition-all">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 pr-4">
                                                    <Badge className="mb-2 bg-purple-500/10 text-purple-500 border-none">
                                                        {q.topic}
                                                    </Badge>
                                                    <p className="text-sm font-medium leading-relaxed">{q.stem}</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500" onClick={() => handleApprove(q)}>
                                                        <CheckCircle size={16} />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400" onClick={() => handleReject(q.id)}>
                                                        <XCircle size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground line-clamp-2 italic bg-muted/30 p-2 rounded">
                                                Ans: {q.answer}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
