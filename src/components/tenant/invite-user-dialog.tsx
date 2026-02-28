"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Copy, Check, Loader2, Link, KeyRound, Eye, EyeOff } from "lucide-react";
import { createInviteToken } from "@/app/actions/invite-actions";
import { adminCreateUser } from "@/app/actions/admin-create-user-action";
import { useAuth } from "@/hooks/use-auth";
import { getStudents } from "@/lib/firebase/services";
import type { Student } from "@/lib/types";

interface InviteUserDialogProps {
    tenantId: string;
    tenantName: string;
}

type InviteRole = "admin" | "executive" | "teacher" | "student" | "parent";

const ROLE_LABELS: Record<InviteRole, { label: string; description: string }> = {
    teacher: { label: "Teacher", description: "Can manage classes, assignments, and attendance" },
    student: { label: "Student", description: "Can view courses, submit assignments, join classes" },
    parent: { label: "Parent", description: "Can monitor children's progress and invoices" },
    admin: { label: "Admin", description: "Full access to all tenant data and settings" },
    executive: { label: "Executive", description: "Read-only access to analytics and reports" },
};

export function InviteUserDialog({ tenantId, tenantName }: InviteUserDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inviteUrl, setInviteUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [role, setRole] = useState<InviteRole>("teacher");
    const [mode, setMode] = useState<"invite" | "create">("invite");
    const { user, tenantId: authTenantId } = useAuth();
    const { toast } = useToast();

    // Direct Create form state
    const [createForm, setCreateForm] = useState({
        email: "",
        password: "",
        fullName: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [createdUser, setCreatedUser] = useState<{ email: string; uid: string } | null>(null);

    // Student list for parent/student linking
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");
    const [loadingStudents, setLoadingStudents] = useState(false);

    // Load students when role is parent or student and dialog is open
    useEffect(() => {
        if (open && (role === "parent" || role === "student") && tenantId) {
            setLoadingStudents(true);
            getStudents(tenantId)
                .then(setStudents)
                .catch(console.error)
                .finally(() => setLoadingStudents(false));
        }
    }, [open, role, tenantId]);

    // --- Invite Link Flow ---
    const handleGenerateLink = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const result = await createInviteToken(
                user.uid,
                tenantId,
                tenantName,
                role as any,
                role === "student" || role === "parent" ? selectedStudentId || undefined : undefined
            );
            if (result.success && result.inviteUrl) {
                setInviteUrl(result.inviteUrl);
                toast({
                    title: "Invite Link Generated",
                    description: `A ${ROLE_LABELS[role].label} invite link has been created.`,
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

    // --- Direct Create Flow ---
    const handleDirectCreate = async () => {
        if (!user) return;

        if (!createForm.email || !createForm.password || !createForm.fullName) {
            toast({
                title: "Missing Fields",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const result = await adminCreateUser(
                user.uid,
                tenantId,
                createForm.email,
                createForm.password,
                createForm.fullName,
                role,
                selectedStudentId || undefined
            );

            if (result.success && result.uid && result.email) {
                setCreatedUser({ email: result.email, uid: result.uid });
                toast({
                    title: "Account Created",
                    description: `${createForm.fullName} can now log in as a ${ROLE_LABELS[role].label}.`,
                });
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to create account.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong while creating the account.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast({ title: "Copied!", description: "Copied to clipboard." });
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast({ title: "Error", description: "Failed to copy.", variant: "destructive" });
        }
    };

    const handleClose = () => {
        setOpen(false);
        setInviteUrl(null);
        setCopied(false);
        setRole("teacher");
        setMode("invite");
        setCreatedUser(null);
        setCreateForm({ email: "", password: "", fullName: "" });
        setSelectedStudentId("");
    };

    const showStudentPicker = role === "parent" || role === "student";

    return (
        <Dialog open={open} onOpenChange={(isOpen) => (isOpen ? setOpen(true) : handleClose())}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Link className="me-2 h-4 w-4" />
                    Invite User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Add a New User</DialogTitle>
                    <DialogDescription>
                        Add someone to <strong>{tenantName}</strong>. Generate an invite link or create their account directly.
                    </DialogDescription>
                </DialogHeader>

                {/* Mode Tabs */}
                <Tabs value={mode} onValueChange={(v) => setMode(v as "invite" | "create")} className="w-full">
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="invite" className="text-sm">
                            <Link className="me-2 h-3.5 w-3.5" />
                            Invite Link
                        </TabsTrigger>
                        <TabsTrigger value="create" className="text-sm">
                            <KeyRound className="me-2 h-3.5 w-3.5" />
                            Direct Create
                        </TabsTrigger>
                    </TabsList>

                    {/* ===== INVITE LINK TAB ===== */}
                    <TabsContent value="invite" className="space-y-4 pt-2">
                        {!inviteUrl ? (
                            <>
                                {/* Role Selector */}
                                <div className="grid gap-2">
                                    <Label>Role</Label>
                                    <Select value={role} onValueChange={(v: InviteRole) => setRole(v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(ROLE_LABELS).map(([value, { label, description }]) => (
                                                <SelectItem key={value} value={value}>
                                                    <div>
                                                        <span className="font-medium">{label}</span>
                                                        <span className="ms-2 text-muted-foreground text-xs">{description}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Student Picker (for parent/student roles) */}
                                {showStudentPicker && (
                                    <div className="grid gap-2">
                                        <Label>
                                            {role === "parent" ? "Link to Student (optional)" : "Link to Student Record (optional)"}
                                        </Label>
                                        <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={loadingStudents ? "Loading..." : "Select student"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">None</SelectItem>
                                                {students.map((s) => (
                                                    <SelectItem key={s.id} value={s.id}>
                                                        {s.name} {s.grade ? `(${s.grade})` : ""}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <DialogFooter>
                                    <Button onClick={handleGenerateLink} disabled={loading} className="w-full">
                                        {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                                        Generate Invite Link
                                    </Button>
                                </DialogFooter>
                            </>
                        ) : (
                            <div className="space-y-3">
                                <Label>Invite Link (expires in 7 days)</Label>
                                <div className="flex gap-2">
                                    <Input value={inviteUrl} readOnly className="flex-1 text-sm" />
                                    <Button variant="outline" size="icon" onClick={() => handleCopy(inviteUrl)}>
                                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={handleClose}>
                                        Done
                                    </Button>
                                </DialogFooter>
                            </div>
                        )}
                    </TabsContent>

                    {/* ===== DIRECT CREATE TAB ===== */}
                    <TabsContent value="create" className="space-y-4 pt-2">
                        {!createdUser ? (
                            <>
                                {/* Role */}
                                <div className="grid gap-2">
                                    <Label>Role</Label>
                                    <Select value={role} onValueChange={(v: InviteRole) => setRole(v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(ROLE_LABELS).map(([value, { label }]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Full Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="dc-name">Full Name</Label>
                                    <Input
                                        id="dc-name"
                                        placeholder="Ahmed Khan"
                                        value={createForm.fullName}
                                        onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                                    />
                                </div>

                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label htmlFor="dc-email">Email (any domain)</Label>
                                    <Input
                                        id="dc-email"
                                        type="email"
                                        placeholder="ahmed@myacademy.edu"
                                        value={createForm.email}
                                        onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                                    />
                                </div>

                                {/* Password */}
                                <div className="grid gap-2">
                                    <Label htmlFor="dc-password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="dc-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={createForm.password}
                                            onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute end-0 top-0 h-full px-3 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                {/* Student Picker */}
                                {showStudentPicker && (
                                    <div className="grid gap-2">
                                        <Label>
                                            {role === "parent" ? "Link to Child" : "Link to Student Record"}
                                        </Label>
                                        <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={loadingStudents ? "Loading..." : "Select student"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">None</SelectItem>
                                                {students.map((s) => (
                                                    <SelectItem key={s.id} value={s.id}>
                                                        {s.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <DialogFooter>
                                    <Button onClick={handleDirectCreate} disabled={loading} className="w-full">
                                        {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                                        <UserPlus className="me-2 h-4 w-4" />
                                        Create Account
                                    </Button>
                                </DialogFooter>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                                    <p className="text-sm font-medium text-green-600">✅ Account Created Successfully</p>
                                    <div className="grid gap-2 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Email:</span>
                                            <div className="flex items-center gap-1">
                                                <code className="text-xs bg-background px-2 py-1 rounded">{createdUser.email}</code>
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(createdUser.email)}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Password:</span>
                                            <div className="flex items-center gap-1">
                                                <code className="text-xs bg-background px-2 py-1 rounded">{createForm.password}</code>
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(createForm.password)}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Share these credentials with the user. They can change their password after first login.
                                    </p>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={handleClose}>
                                        Done
                                    </Button>
                                </DialogFooter>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
