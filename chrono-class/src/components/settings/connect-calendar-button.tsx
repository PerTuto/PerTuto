"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, CheckCircle, XCircle, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase/client-app";

export function ConnectCalendarButton() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!user) return;

        // Real-time listener for connection status
        const unsubscribe = onSnapshot(doc(firestore, `users/${user.uid}/integrations/google`), (doc) => {
            setConnected(doc.exists() && doc.data()?.connected === true);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleConnect = () => {
        if (!user) return;
        // Redirect to API route with UID state
        window.location.href = `/api/auth/google/signin?uid=${user.uid}`;
    };

    if (loading) {
        return <Button disabled variant="outline"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...</Button>;
    }

    if (connected) {
        return (
            <div className="flex items-center gap-4">
                <Button variant="outline" className="text-green-600 border-green-200 hover:text-green-700 hover:bg-green-50 pointer-events-none">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Calendar Connected
                </Button>
                <Button variant="link" className="text-muted-foreground text-xs" onClick={handleConnect}>
                    Reconnect
                </Button>
            </div>
        );
    }

    return (
        <Button onClick={handleConnect} variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Connect Google Calendar
        </Button>
    );
}
