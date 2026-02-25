"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getTestimonials, updateTestimonialStatus, deleteTestimonial } from "@/lib/firebase/services";
import type { Testimonial } from "@/lib/types";
import { TestimonialStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Check, X, Trash2, Copy, Link2, ExternalLink, Loader2, MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function TestimonialsPage() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const tenantId = userProfile?.tenantId;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    if (tenantId) fetchTestimonials();
  }, [tenantId]);

  async function fetchTestimonials() {
    if (!tenantId) return;
    setLoading(true);
    try {
      const data = await getTestimonials(tenantId);
      setTestimonials(data.sort((a: any, b: any) => b.createdAt?.getTime?.() - a.createdAt?.getTime?.()));
    } catch (e) {
      toast({ title: "Error", description: "Failed to load testimonials", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: TestimonialStatus) {
    if (!tenantId) return;
    setProcessingId(id);
    try {
      await updateTestimonialStatus(tenantId, id, status);
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      toast({ title: status === TestimonialStatus.Approved ? "Approved" : "Rejected", description: `Testimonial has been ${status}.` });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!tenantId) return;
    setProcessingId(id);
    try {
      await deleteTestimonial(tenantId, id);
      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast({ title: "Deleted", description: "Testimonial removed." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  }

  function copyShareLink() {
    const link = `${baseUrl}/testimonials/submit?tenant=${tenantId}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Link Copied!", description: "Share this link with your clients to collect testimonials." });
  }

  const statusBadge = (status: TestimonialStatus) => {
    switch (status) {
      case TestimonialStatus.Pending:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case TestimonialStatus.Approved:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case TestimonialStatus.Rejected:
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
    }
  };

  const pending = testimonials.filter(t => t.status === TestimonialStatus.Pending);
  const approved = testimonials.filter(t => t.status === TestimonialStatus.Approved);
  const rejected = testimonials.filter(t => t.status === TestimonialStatus.Rejected);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Testimonials</h1>
          <p className="text-muted-foreground">Collect and manage testimonials from your clients.</p>
        </div>
      </div>

      {/* Share Link Card */}
      <Card className="border-primary/20 bg-primary/[0.02]">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Link2 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1">Shareable Submission Link</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Share this link with your students and parents to collect testimonials.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted px-3 py-2 rounded-lg text-xs font-mono truncate">
                  {baseUrl}/testimonials/submit?tenant={tenantId}
                </code>
                <Button size="sm" variant="outline" onClick={copyShareLink} className="shrink-0 gap-2">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </Button>
                <Button size="sm" variant="outline" asChild className="shrink-0 gap-2">
                  <a href={`/testimonials/submit?tenant=${tenantId}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5" /> Preview
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Pending Review</div>
          <div className="text-2xl font-bold text-amber-600">{pending.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Published</div>
          <div className="text-2xl font-bold text-green-600">{approved.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Received</div>
          <div className="text-2xl font-bold">{testimonials.length}</div>
        </Card>
      </div>

      {/* Pending Section */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Awaiting Review ({pending.length})
          </h2>
          <div className="grid gap-4">
            {pending.map(t => (
              <TestimonialCard
                key={t.id}
                testimonial={t}
                statusBadge={statusBadge}
                processing={processingId === t.id}
                onApprove={() => handleStatusChange(t.id, TestimonialStatus.Approved)}
                onReject={() => handleStatusChange(t.id, TestimonialStatus.Rejected)}
                onDelete={() => handleDelete(t.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Approved Section */}
      {approved.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Published ({approved.length})
          </h2>
          <div className="grid gap-4">
            {approved.map(t => (
              <TestimonialCard
                key={t.id}
                testimonial={t}
                statusBadge={statusBadge}
                processing={processingId === t.id}
                onReject={() => handleStatusChange(t.id, TestimonialStatus.Rejected)}
                onDelete={() => handleDelete(t.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Rejected Section */}
      {rejected.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Rejected ({rejected.length})
          </h2>
          <div className="grid gap-4">
            {rejected.map(t => (
              <TestimonialCard
                key={t.id}
                testimonial={t}
                statusBadge={statusBadge}
                processing={processingId === t.id}
                onApprove={() => handleStatusChange(t.id, TestimonialStatus.Approved)}
                onDelete={() => handleDelete(t.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {testimonials.length === 0 && (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <MessageSquareQuote className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No Testimonials Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Share your collection link with clients to start receiving testimonials. They'll appear here for your review.
            </p>
            <Button onClick={copyShareLink} className="gap-2">
              <Copy className="w-4 h-4" /> Copy Collection Link
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

// ── Testimonial Card ──
function TestimonialCard({
  testimonial: t,
  statusBadge,
  processing,
  onApprove,
  onReject,
  onDelete,
}: {
  testimonial: Testimonial;
  statusBadge: (s: TestimonialStatus) => React.ReactNode;
  processing: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
              {t.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {statusBadge(t.status)}
            <span className="text-xs text-muted-foreground">
              {t.createdAt ? format(t.createdAt, 'MMM d, yyyy') : ''}
            </span>
          </div>
        </div>

        <div className="flex gap-0.5 mb-3">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              className={cn(
                "w-4 h-4",
                star <= t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
              )}
            />
          ))}
        </div>

        <blockquote className="text-sm text-foreground/85 leading-relaxed italic mb-4">
          "{t.quote}"
        </blockquote>

        <div className="flex items-center gap-2 pt-3 border-t">
          {onApprove && t.status !== TestimonialStatus.Approved && (
            <Button size="sm" variant="outline" onClick={onApprove} disabled={processing} className="gap-1.5 text-green-700 hover:bg-green-50 hover:text-green-800">
              {processing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
              Approve
            </Button>
          )}
          {onReject && t.status !== TestimonialStatus.Rejected && (
            <Button size="sm" variant="outline" onClick={onReject} disabled={processing} className="gap-1.5 text-red-700 hover:bg-red-50 hover:text-red-800">
              {processing ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
              Reject
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onDelete} disabled={processing} className="gap-1.5 ml-auto text-muted-foreground hover:text-destructive">
            <Trash2 className="w-3 h-3" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
