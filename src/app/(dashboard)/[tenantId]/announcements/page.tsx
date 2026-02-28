
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  getAnnouncements, 
  createAnnouncement, 
  deleteAnnouncement,
  getCenters,
  getCourses,
  getBatches
} from "@/lib/firebase/services";
import { Announcement, Center, Course, Batch } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Clock, 
  Users, 
  Send,
  Loader2,
  Calendar,
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AnnouncementsPage() {
  const { tenantId } = useParams() as { tenantId: string };
  const { toast } = useToast();
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [newAnnouncement, setNewAnnouncement] = useState<Partial<Announcement>>({
    title: "",
    body: "",
    targetType: "all",
    targetIds: [],
    priority: "medium",
  });

  const [centers, setCenters] = useState<Center[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [a, c, co, b] = await Promise.all([
        getAnnouncements(tenantId),
        getCenters(tenantId),
        getCourses(tenantId),
        getBatches(tenantId)
      ]);
      setAnnouncements(a);
      setCenters(c);
      setCourses(co);
      setBatches(b);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load announcements", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tenantId]);

  const handleCreate = async () => {
    if (!newAnnouncement.title || !newAnnouncement.body) {
      toast({ title: "Missing Fields", description: "Please provide both a title and a message.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      await createAnnouncement(tenantId, {
        title: newAnnouncement.title!,
        body: newAnnouncement.body!,
        targetType: newAnnouncement.targetType as any,
        targetIds: newAnnouncement.targetIds || [],
        priority: newAnnouncement.priority as any,
        createdBy: user?.uid || "Admin"
      });
      toast({ title: "Broadcast Sent", description: "Your announcement has been published." });
      setIsDialogOpen(false);
      setNewAnnouncement({ title: "", body: "", targetType: "all", targetIds: [], priority: "medium" });
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create announcement", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await deleteAnnouncement(tenantId, id);
      toast({ title: "Deleted", description: "Announcement removed from feed." });
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete announcement", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-outfit text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-primary" /> Notice Board
          </h1>
          <p className="text-muted-foreground dark:text-white/40">Broadcast news, updates, and urgent alerts to your community.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 me-2" /> New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Broadcast Announcement</DialogTitle>
              <DialogDescription className="text-muted-foreground dark:text-white/40">
                This will send notifications to the selected audience.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-muted-foreground dark:text-white/40">Title</Label>
                <Input 
                  placeholder="e.g., School holiday tomorrow" 
                  className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 h-11 rounded-xl text-slate-900 dark:text-white"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-muted-foreground dark:text-white/40">Message</Label>
                <Textarea 
                  placeholder="Type your message here..." 
                  className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl min-h-[120px] text-slate-900 dark:text-white"
                  value={newAnnouncement.body}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, body: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground dark:text-white/40">Priority</Label>
                  <Select 
                    value={newAnnouncement.priority} 
                    onValueChange={(val) => setNewAnnouncement({...newAnnouncement, priority: val as any})}
                  >
                    <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl h-11 text-slate-900 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground dark:text-white/40">Audience</Label>
                  <Select 
                    value={newAnnouncement.targetType} 
                    onValueChange={(val) => setNewAnnouncement({...newAnnouncement, targetType: val as any, targetIds: []})}
                  >
                    <SelectTrigger className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl h-11 text-slate-900 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-glass-heavy border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                      <SelectItem value="all">Everyone</SelectItem>
                      <SelectItem value="center">Specific Center</SelectItem>
                      <SelectItem value="course">Course Students</SelectItem>
                      <SelectItem value="batch">Specific Batch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-12"
                onClick={handleCreate}
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin me-2" /> : <Send className="w-4 h-4 me-2" />}
                Publish Broadcast
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : announcements.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {announcements.map((ann) => (
            <Card key={ann.id} className="bg-glass border-slate-200 dark:border-white/5 hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-[3] space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className={
                        ann.priority === 'urgent' ? 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20' :
                        ann.priority === 'high' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20' :
                        'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20'
                      }>
                        {ann.priority.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] font-black text-muted-foreground dark:text-white/40 uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {format(ann.createdAt, 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{ann.title}</h3>
                      <p className="text-sm text-slate-700 dark:text-white/60 leading-relaxed font-light whitespace-pre-wrap">{ann.body}</p>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between border-l border-slate-200 dark:border-white/5 ps-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground dark:text-white/40 uppercase tracking-widest">
                        <Users className="w-3.5 h-3.5" /> Target Audience
                      </div>
                      <Badge variant="outline" className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-600 dark:text-white/60">
                        {ann.targetType === 'all' ? 'All Community' : `Targeted ${ann.targetType}`}
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-500/10 h-10 w-10 p-0 self-end rounded-xl"
                      onClick={() => handleDelete(ann.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-50 dark:bg-white/5 border-dashed border-slate-200 dark:border-white/10 p-24 text-center">
            <CardContent className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6 text-muted-foreground dark:text-white/40">
                    <Megaphone className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nothing broadcasted yet</h3>
                <p className="text-muted-foreground dark:text-white/40 max-w-sm mx-auto">Publish updates and alerts here to keep your institution informed in real-time.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
