"use client";

import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  Download,
  CheckCircle2,
  Loader2,
  Calendar,
  X,
} from "lucide-react";
import { uploadAssignmentFile, getAssignmentFiles } from "@/lib/firebase/storage-services";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase/client-app";
import type { Assignment, UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AssignmentDetailDialogProps {
  assignment: Assignment;
  tenantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
}

export function AssignmentDetailDialog({
  assignment,
  tenantId,
  open,
  onOpenChange,
  onUpdated,
}: AssignmentDetailDialogProps) {
  const { userProfile, user } = useAuth();
  const { toast } = useToast();

  const [uploading, setUploading] = useState(false);
  const [grading, setGrading] = useState(false);
  const [grade, setGrade] = useState(assignment.grade || "");
  const [feedback, setFeedback] = useState(assignment.feedback || "");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isTeacher =
    userProfile?.role === "teacher" ||
    userProfile?.role === "admin" ||
    userProfile?.role === "super";

  const isStudent =
    userProfile?.role === "student" || userProfile?.role === "parent";

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0 || !user) return;
      setUploading(true);

      try {
        const uploadPromises = Array.from(files).map((file) =>
          uploadAssignmentFile(file, assignment.id, user.uid, tenantId)
        );
        const urls = await Promise.all(uploadPromises);

        // Update assignment with submission URLs and mark as Submitted
        const assignmentRef = doc(
          firestore,
          `tenants/${tenantId}/assignments`,
          assignment.id
        );
        await updateDoc(assignmentRef, {
          submissionUrls: [...(assignment.submissionUrls || []), ...urls],
          submittedBy: user.uid,
          submittedAt: Timestamp.fromDate(new Date()),
          status: "Submitted",
        });

        toast({
          title: "Files Uploaded! 📎",
          description: `${files.length} file(s) submitted successfully. Status updated to Submitted.`,
        });
        onUpdated?.();
      } catch (error: any) {
        toast({
          title: "Upload Failed",
          description: error.message || "Could not upload files.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    },
    [assignment, tenantId, user, toast, onUpdated]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      handleUpload(e.dataTransfer.files);
    },
    [handleUpload]
  );

  const handleGrade = async () => {
    if (!grade.trim()) {
      toast({
        title: "Error",
        description: "Please enter a grade.",
        variant: "destructive",
      });
      return;
    }

    setGrading(true);
    try {
      const assignmentRef = doc(
        firestore,
        `tenants/${tenantId}/assignments`,
        assignment.id
      );
      await updateDoc(assignmentRef, {
        grade,
        feedback,
        status: "Graded",
      });

      toast({
        title: "Assignment Graded ✅",
        description: `Grade: ${grade}. Feedback has been saved.`,
      });
      onUpdated?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not save grade.",
        variant: "destructive",
      });
    } finally {
      setGrading(false);
    }
  };

  const statusColor: Record<string, string> = {
    Pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    Submitted:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    Graded:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            {assignment.title}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 pt-1">
            <Calendar className="h-4 w-4" />
            Due: {(assignment.dueDate && typeof assignment.dueDate === 'object' && 'toDate' in assignment.dueDate ? (assignment.dueDate as any).toDate() : new Date(assignment.dueDate)).toLocaleDateString()}
            <Badge
              className={cn(
                "ml-2 border-transparent",
                statusColor[assignment.status] || ""
              )}
            >
              {assignment.status}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Description */}
          {assignment.description && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {assignment.description}
            </div>
          )}

          {/* Student: Upload Zone */}
          {isStudent && assignment.status === "Pending" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Submit Your Work</Label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
                )}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Uploading...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Drag & drop files here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOCX, images — up to 10MB each
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </div>
            </div>
          )}

          {/* Submitted Files */}
          {assignment.submissionUrls && assignment.submissionUrls.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Submitted Files</Label>
              <div className="space-y-2">
                {assignment.submissionUrls.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-md border hover:bg-muted/50 transition-colors text-sm"
                  >
                    <Download className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="truncate">
                      Submission {idx + 1}
                    </span>
                  </a>
                ))}
              </div>
              {assignment.submittedAt && (
                <p className="text-xs text-muted-foreground">
                  Submitted{" "}
                  {new Date(assignment.submittedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Teacher: Grading Section */}
          {isTeacher && assignment.status === "Submitted" && (
            <div className="space-y-3 border-t pt-4">
              <Label className="text-sm font-medium">
                Grade This Assignment
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="grade" className="text-xs">
                    Grade <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="grade"
                    placeholder="A+, 95%, etc."
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="feedback" className="text-xs">
                  Feedback (Optional)
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Great work! Consider reviewing..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                />
              </div>
              <Button onClick={handleGrade} disabled={grading}>
                {grading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Graded
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Show grade/feedback if already graded */}
          {assignment.status === "Graded" && (
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-medium">
                  Grade: {assignment.grade}
                </span>
              </div>
              {assignment.feedback && (
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs font-medium mb-1">Teacher Feedback:</p>
                  {assignment.feedback}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
