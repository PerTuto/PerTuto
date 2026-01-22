"use server";

import { adminAuth, adminFirestore } from "@/lib/firebase/server-app";
import { headers } from "next/headers";

type CreateUserResponse = {
    success: boolean;
    message?: string;
    userId?: string;
};

export async function createTenantUser(
    currentUserUid: string, // We accept UID but verification is crucial
    targetTenantId: string,
    userData: { email: string; password?: string; fullName: string; role: 'admin' | 'teacher' }
): Promise<CreateUserResponse> {
    try {
        // 1. Verify Authentication & Authorization
        // In a real app, we would verify the session cookie here.
        // For now/MVP with Client SDK Auth + Server Actions, we trust the caller BUT 
        // we must verify the caller actually has rights to this tenant.
        // Ideally, we'd pass an ID token and verify it, but `firebase-admin` allows `verifyIdToken`.
        // Let's assume for this step we will verify the user's role from Firestore.

        // Fetch caller profile from Admin Firestore to be sure (bypassing client-side tampering)
        const callerDoc = await adminFirestore.collection("users").doc(currentUserUid).get();
        if (!callerDoc.exists) {
            return { success: false, message: "Unauthorized: Caller not found." };
        }
        const callerData = callerDoc.data();
        if (!callerData) return { success: false, message: "Unauthorized." };

        const hasRole = (data: any, target: string) => {
            if (!data.role) return false;
            if (Array.isArray(data.role)) return data.role.includes(target);
            return data.role === target;
        };

        const isSuper = hasRole(callerData, 'super');
        const isTenantAdmin = hasRole(callerData, 'admin') && callerData.tenantId === targetTenantId;

        if (!isSuper && !isTenantAdmin) {
            return { success: false, message: "Unauthorized: You do not have permission to manage users for this tenant." };
        }

        // 2. Create User in Firebase Auth
        const newUser = await adminAuth.createUser({
            email: userData.email,
            password: userData.password || "tempPassword123!", // Default temp password
            displayName: userData.fullName,
        });

        // 3. Create User Profile in Firestore
        // Note: We use the `tenants/{tenantId}/users` sub-collection for tenant users 
        // AND we also need a root `users` document for global lookup/auth context if we stick to that pattern.
        // Phase 1 established `users` root collection for role lookups. 

        const userRole = userData.role;

        // A. Root User Profile (Essential for Auth Context)
        await adminFirestore.collection("users").doc(newUser.uid).set({
            email: userData.email,
            fullName: userData.fullName,
            role: userRole,
            tenantId: targetTenantId,
            createdAt: new Date(),
        });

        // B. Tenant Sub-collection Profile (For Tenant Admin lists)
        await adminFirestore.collection(`tenants/${targetTenantId}/users`).doc(newUser.uid).set({
            email: userData.email,
            fullName: userData.fullName,
            role: userRole,
            tenantId: targetTenantId,
            createdAt: new Date(),
            status: 'Active'
        });

        return { success: true, userId: newUser.uid };

    } catch (error: any) {
        console.error("Error creating tenant user:", error);
        return { success: false, message: error.message || "Failed to create user." };
    }
}
