"use client";

import { useState } from "react";
import { Copy, Loader2, Link as LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createInviteToken } from "@/app/actions/invite-actions";
import { useAuth } from "@/hooks/use-auth";
import type { Student } from "@/lib/types";

export function InviteStudentDialog({
  student,
  open,
  onOpenChange,
}: {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const handleGenerateLink = async () => {
    if (!user || !userProfile?.tenantId) return;

    setLoading(true);
    setInviteUrl(null);
    setCopied(false);

    try {
      const result = await createInviteToken(
        user.uid,
        userProfile.tenantId,
        "PerTuto", // Tenant Name (could be fetched dynamically if supported)
        "student",
        student.id
      );

      if (result.success && result.inviteUrl) {
        setInviteUrl(result.inviteUrl);
      } else {
        throw new Error(result.message || "Failed to generate link");
      }
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Could not generate login link.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Login link copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">Generate Student Login</DialogTitle>
          <DialogDescription>
            Create a secure, one-time registration link for {student.name}. They will use this to set their password and access their portal.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {!inviteUrl ? (
            <Button 
                onClick={handleGenerateLink} 
                disabled={loading}
                className="w-full h-12 text-base"
            >
              {loading ? (
                <><Loader2 className="me-2 h-5 w-5 animate-spin" /> Generating Link...</>
              ) : (
                <><LinkIcon className="me-2 h-5 w-5" /> Generate Magic Link</>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                Link generated successfully! This link will expire in 7 days.
              </p>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Input
                    id="link"
                    defaultValue={inviteUrl}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <Button size="icon" onClick={copyToClipboard} variant="secondary">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
