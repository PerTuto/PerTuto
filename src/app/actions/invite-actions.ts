"use server";

import { adminFirestore } from "@/lib/firebase/server-app";
import crypto from "crypto";

export type InviteTokenData = {
    tenantId: string;
    tenantName: string;
    role: 'admin' | 'teacher' | 'student' | 'parent';
    createdBy: string;
    createdAt: Date;
    expiresAt: Date;
    used: boolean;
    studentId?: string | null;
};

type CreateInviteResponse = {
    success: boolean;
    inviteCode?: string;
    inviteUrl?: string;
    message?: string;
};

/**
 * Creates a new invite token for a tenant.
 * Only admins or super users can create invites.
 */
export async function createInviteToken(
    currentUserUid: string,
    tenantId: string,
    tenantName: string,
    role: 'admin' | 'teacher' | 'student' | 'parent',
    studentId?: string // Optional metadata for mapping the user to a student profile
): Promise<CreateInviteResponse> {
    try {
        // Verify caller authorization
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
        const isTenantAdmin = hasRole(callerData, 'admin') && callerData.tenantId === tenantId;

        if (!isSuper && !isTenantAdmin) {
            return { success: false, message: "Unauthorized: You cannot create invites for this tenant." };
        }

        // Generate a unique invite code using Node's built-in crypto
        const inviteCode = crypto.randomUUID().slice(0, 12);

        // Store invite token in Firestore
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

        await adminFirestore.collection("invites").doc(inviteCode).set({
            tenantId,
            tenantName,
            role,
            createdBy: currentUserUid,
            createdAt: new Date(),
            expiresAt,
            used: false,
            studentId: studentId || null,
        });

        // Construct the invite URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const inviteUrl = `${baseUrl}/join/${inviteCode}`;

        return { success: true, inviteCode, inviteUrl };

    } catch (error: any) {
        console.error("Error creating invite token:", error);
        return { success: false, message: error.message || "Failed to create invite." };
    }
}

/**
 * Retrieves invite token data by code.
 */
export async function getInviteToken(inviteCode: string): Promise<InviteTokenData | null> {
    try {
        const inviteDoc = await adminFirestore.collection("invites").doc(inviteCode).get();
        if (!inviteDoc.exists) {
            return null;
        }
        const data = inviteDoc.data();
        if (!data) return null;

        // Helper to safely convert Firestore Timestamps or Date objects
        const toDate = (val: any): Date => {
            if (val?.toDate) return val.toDate();
            if (val instanceof Date) return val;
            return new Date(val);
        };

        return {
            tenantId: data.tenantId,
            tenantName: data.tenantName,
            role: data.role,
            createdBy: data.createdBy,
            createdAt: toDate(data.createdAt),
            expiresAt: toDate(data.expiresAt),
            used: data.used,
        };
    } catch (error) {
        console.error("Error fetching invite token:", error);
        return null;
    }
}

/**
 * Marks an invite token as used.
 */
export async function markInviteUsed(inviteCode: string): Promise<void> {
    await adminFirestore.collection("invites").doc(inviteCode).update({
        used: true,
        usedAt: new Date(),
    });
}
