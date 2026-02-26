"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useAuth } from "@/hooks/use-auth";
import { firebaseApp } from "@/lib/firebase/client-app";

export default function DebugAuthPage() {
    const { user, loading } = useAuth();
    const [tokenClaims, setTokenClaims] = useState<any>(null);

    useEffect(() => {
        if (user) {
            user.getIdTokenResult().then((result) => {
                setTokenClaims(result.claims);
            });
        }
    }, [user]);

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Not logged in</div>;

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Auth Debugger</h1>
            <div className="space-y-2">
                <p><strong>UID:</strong> {user.uid}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
                <div className="bg-slate-100 p-4 rounded mt-4">
                    <strong>Token Claims:</strong>
                    <pre>{JSON.stringify(tokenClaims, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
}
