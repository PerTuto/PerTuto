"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getInviteToken, markInviteUsed, type InviteTokenData } from "@/app/actions/invite-actions";
import { Loader2, UserPlus, AlertTriangle } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client-app";
import { createUserProfile } from "@/lib/firebase/services";

export default function JoinPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const token = params.token as string;

    const [loading, setLoading] = useState(true);
    const [invite, setInvite] = useState<InviteTokenData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        async function loadInvite() {
            if (!token) {
                setError("Invalid invite link.");
                setLoading(false);
                return;
            }

            const inviteData = await getInviteToken(token);

            if (!inviteData) {
                setError("Invite link not found or has expired.");
                setLoading(false);
                return;
            }

            if (inviteData.used) {
                setError("This invite link has already been used.");
                setLoading(false);
                return;
            }

            if (new Date() > inviteData.expiresAt) {
                setError("This invite link has expired.");
                setLoading(false);
                return;
            }

            setInvite(inviteData);
            setLoading(false);
        }

        loadInvite();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!invite) return;

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match.",
                variant: "destructive",
            });
            return;
        }

        if (formData.password.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters.",
                variant: "destructive",
            });
            return;
        }

        setSubmitting(true);

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Create user profile in Firestore
            await createUserProfile(userCredential.user.uid, {
                fullName: formData.fullName,
                email: formData.email,
                role: invite.role,
                tenantId: invite.tenantId,
            });

            // Mark invite as used
            await markInviteUsed(token);

            toast({
                title: "Welcome!",
                description: `You've joined ${invite.tenantName} as a ${invite.role}.`,
            });

            // Redirect to dashboard
            router.push("/dashboard");

        } catch (error: any) {
            console.error("Join error:", error);
            let message = "Failed to create account.";
            if (error.code === 'auth/email-already-in-use') {
                message = "This email is already registered. Please sign in instead.";
            }
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
                        <CardTitle>Invalid Invite</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={() => router.push("/")}>
                            Go to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <UserPlus className="mx-auto h-12 w-12 text-primary mb-4" />
                    <CardTitle>Join {invite?.tenantName}</CardTitle>
                    <CardDescription>
                        You've been invited to join as a <strong className="text-foreground">{invite?.role}</strong>.
                        Create your account to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account & Join
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
