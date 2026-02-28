"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/types";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRoles={[UserRole.Super]}>
            <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950">
                {/* Temporary Header for navigation */}
                <div className="absolute top-4 end-4 z-10">
                    <Link href="/">
                        <Button variant="outline">Back to App</Button>
                    </Link>
                </div>
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8">
                        {children}
                    </div>
                </div>
            </div>
        </RoleGuard>
    );
}
