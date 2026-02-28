"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CalendarClock } from "lucide-react";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase/client-app";
import { Class } from "@/lib/types";

interface RescheduleRequestDialogProps {
  classItem: Class;
  tenantId: string;
  onRequested?: () => void;
  trigger?: React.ReactNode;
}

export function RescheduleRequestDialog({
  classItem,
  tenantId,
  onRequested,
  trigger,
}: RescheduleRequestDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !tenantId) return;

    if (!newDate || !newTime) {
      toast({ title: "Error", description: "Please select a new date and time.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const requestedTime = new Date(`${newDate}T${newTime}`);

      const classRef = doc(firestore, `tenants/${tenantId}/classes`, classItem.id);
      await updateDoc(classRef, {
        rescheduleStatus: "requested",
        requestedTime: Timestamp.fromDate(requestedTime),
        requestedBy: user.uid,
        rescheduleReason: reason || "No reason provided.",
      });

      toast({
        title: "Reschedule Requested",
        description: "Your teacher has been notified and will review your request.",
      });
      setOpen(false);
      setNewDate("");
      setNewTime("");
      setReason("");
      onRequested?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit reschedule request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const classRef = doc(firestore, `tenants/${tenantId}/classes`, classItem.id);
      
      if (classItem.requestedTime) {
        const requestedDate = classItem.requestedTime instanceof Date 
          ? classItem.requestedTime 
          : new Date(classItem.requestedTime);
        
        // Calculate the duration of the original class
        const originalStart = classItem.start instanceof Date ? classItem.start : new Date(classItem.start);
        const originalEnd = classItem.end instanceof Date ? classItem.end : new Date(classItem.end);
        const durationMs = originalEnd.getTime() - originalStart.getTime();
        
        const newEnd = new Date(requestedDate.getTime() + durationMs);

        await updateDoc(classRef, {
          start: Timestamp.fromDate(requestedDate),
          end: Timestamp.fromDate(newEnd),
          rescheduleStatus: "approved",
          requestedTime: null,
          requestedBy: null,
          rescheduleReason: null,
        });
      }

      toast({ title: "Approved", description: "The class has been rescheduled successfully." });
      onRequested?.();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to approve.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const classRef = doc(firestore, `tenants/${tenantId}/classes`, classItem.id);
      await updateDoc(classRef, {
        rescheduleStatus: "rejected",
        requestedTime: null,
        requestedBy: null,
        rescheduleReason: null,
      });

      toast({ title: "Rejected", description: "The reschedule request has been denied." });
      onRequested?.();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to reject.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // If this class has a pending request and the viewer is a teacher, show approve/reject
  if (classItem.rescheduleStatus === "requested") {
    const requestedDate = classItem.requestedTime instanceof Date
      ? classItem.requestedTime
      : classItem.requestedTime ? new Date(classItem.requestedTime) : null;

    return (
      <div className="flex flex-col gap-2 p-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          ⏳ Reschedule Requested
        </p>
        {requestedDate && (
          <p className="text-xs text-muted-foreground">
            Proposed: {requestedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at{' '}
            {requestedDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
        {classItem.rescheduleReason && (
          <p className="text-xs text-muted-foreground italic">
            Reason: {classItem.rescheduleReason}
          </p>
        )}
        <div className="flex gap-2 mt-1">
          <Button size="sm" onClick={handleApprove} disabled={loading}>
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Approve"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleReject} disabled={loading}>
            Deny
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1.5">
            <CalendarClock className="h-4 w-4" />
            Reschedule
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              Request Reschedule
            </DialogTitle>
            <DialogDescription>
              Propose a new date and time for &quot;{classItem.title || 'this class'}&quot;. Your teacher will review and approve/reject the request.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="newDate">New Date <span className="text-destructive">*</span></Label>
                <Input
                  id="newDate"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="newTime">New Time <span className="text-destructive">*</span></Label>
                <Input
                  id="newTime"
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="E.g., I have a doctor's appointment at that time."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
