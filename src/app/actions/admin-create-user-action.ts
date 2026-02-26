"use server";

import { adminAuth, adminFirestore } from "@/lib/firebase/server-app";
import { z } from "zod";

// --- Types ---

type AdminCreateUserResponse = {
    success: boolean;
    uid?: string;
    email?: string;
    message?: string;
};

// --- Validation Schema ---

const createUserSchema = z.object({
    callerUid: z.string().min(1, "Caller UID is required"),
    tenantId: z.string().min(1, "Tenant ID is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    role: z.enum(["admin", "executive", "teacher", "student", "parent"]),
    linkedStudentId: z.string().optional(),
});

// --- Server Action ---

/**
 * Creates a new user account directly via Firebase Admin SDK.
 * This allows admins to provision accounts with any email domain
 * (e.g., student@myacademy.edu) without the domain needing to exist.
 *
 * Only super admins or tenant admins can call this action.
 */
export async function adminCreateUser(
    callerUid: string,
    tenantId: string,
    email: string,
    password: string,
    fullName: string,
    role: "admin" | "executive" | "teacher" | "student" | "parent",
    linkedStudentId?: string
): Promise<AdminCreateUserResponse> {
    try {
        // 1. Validate input
        const validation = createUserSchema.safeParse({
            callerUid,
            tenantId,
            email,
            password,
            fullName,
            role,
            linkedStudentId,
        });

        if (!validation.success) {
            return {
                success: false,
                message: "Validation failed: " + validation.error.errors.map(e => e.message).join(", "),
            };
        }

        // 2. Verify caller authorization
        const callerDoc = await adminFirestore.collection("users").doc(callerUid).get();
        if (!callerDoc.exists) {
            return { success: false, message: "Unauthorized: Caller profile not found." };
        }

        const callerData = callerDoc.data();
        if (!callerData) {
            return { success: false, message: "Unauthorized: Caller data is empty." };
        }

        const hasRole = (data: any, target: string): boolean => {
            if (!data.role) return false;
            if (Array.isArray(data.role)) return data.role.includes(target);
            return data.role === target;
        };

        const isSuper = hasRole(callerData, "super");
        const isTenantAdmin = hasRole(callerData, "admin") && callerData.tenantId === tenantId;

        if (!isSuper && !isTenantAdmin) {
            return {
                success: false,
                message: "Unauthorized: Only super admins or tenant admins can create users.",
            };
        }

        // 3. Create Firebase Auth user (supports any email domain)
        const userRecord = await adminAuth.createUser({
            email,
            password,
            displayName: fullName,
            emailVerified: false, // Admin-created accounts start unverified
        });

        const uid = userRecord.uid;

        // 4. Create Firestore user profile
        await adminFirestore.collection("users").doc(uid).set({
            fullName,
            email,
            role,
            tenantId,
            avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
            createdAt: new Date(),
            createdBy: callerUid,
        });

        // 5. Link parent to student if applicable
        if (role === "parent" && linkedStudentId) {
            const studentRef = adminFirestore
                .collection("tenants")
                .doc(tenantId)
                .collection("students")
                .doc(linkedStudentId);

            const studentDoc = await studentRef.get();
            if (studentDoc.exists) {
                await studentRef.update({ parentId: uid });
            }
        }

        // 6. Link student auth account to student record if applicable
        if (role === "student" && linkedStudentId) {
            const studentRef = adminFirestore
                .collection("tenants")
                .doc(tenantId)
                .collection("students")
                .doc(linkedStudentId);

            const studentDoc = await studentRef.get();
            if (studentDoc.exists) {
                await studentRef.update({
                    userId: uid,
                    name: fullName,
                });
            }
        }

        return {
            success: true,
            uid,
            email,
        };
    } catch (error: any) {
        console.error("Error in adminCreateUser:", error);

        // Handle specific Firebase Auth errors
        if (error.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "A user with this email address already exists.",
            };
        }
        if (error.code === "auth/invalid-password") {
            return {
                success: false,
                message: "Password must be at least 6 characters.",
            };
        }

        return {
            success: false,
            message: error.message || "Failed to create user account.",
        };
    }
}
