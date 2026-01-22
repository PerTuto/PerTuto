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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Copy, Check, Loader2, Link } from "lucide-react";
import { createInviteToken } from "@/app/actions/invite-actions";
import { useAuth } from "@/hooks/use-auth";

interface InviteUserDialogProps {
    tenantId: string;
    tenantName: string;
}

export function InviteUserDialog({ tenantId, tenantName }: InviteUserDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inviteUrl, setInviteUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [role, setRole] = useState<'admin' | 'teacher'>('teacher');
    const { user } = useAuth();
    const { toast } = useToast();

    const handleGenerateLink = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const result = await createInviteToken(user.uid, tenantId, tenantName, role);
            if (result.success && result.inviteUrl) {
                setInviteUrl(result.inviteUrl);
                toast({
                    title: "Invite Link Generated",
                    description: "Copy the link and share it with the new user.",
                });
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to generate invite link.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!inviteUrl) return;
        try {
            await navigator.clipboard.writeText(inviteUrl);
            setCopied(true);
            toast({
                title: "Copied!",
                description: "Invite link copied to clipboard.",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to copy link.",
                variant: "destructive",
            });
        }
    };

    const handleClose = () => {
        setOpen(false);
        setInviteUrl(null);
        setCopied(false);
        setRole('teacher');
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => isOpen ? setOpen(true) : handleClose()}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Link className="mr-2 h-4 w-4" />
                    Invite User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Invite a New User</DialogTitle>
                    <DialogDescription>
                        Generate an invite link for someone to join <strong>{tenantName}</strong>.
                        The link will expire in 7 days.
                    </DialogDescription>
                </DialogHeader>

                {!inviteUrl ? (
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role for New User</Label>
                            <Select value={role} onValueChange={(v: 'admin' | 'teacher') => setRole(v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleGenerateLink} disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate Invite Link
                            </Button>
                        </DialogFooter>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Invite Link (expires in 7 days)</Label>
                            <div className="flex gap-2">
                                <Input value={inviteUrl} readOnly className="flex-1 text-sm" />
                                <Button variant="outline" size="icon" onClick={handleCopy}>
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose}>Done</Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
