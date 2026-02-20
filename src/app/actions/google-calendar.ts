"use server";

import { adminFirestore } from "@/lib/firebase/server-app";
import { getOAuth2Client } from "@/lib/google-calendar";
import { Timestamp } from "firebase-admin/firestore";
import { google } from "googleapis";

/**
 * Syncs a specific class session to Google Calendar.
 * Can be used for Create, Update, or Delete (pass isDelete=true).
 */
export async function syncClassToGoogle(userId: string, classId: string, isDelete: boolean = false) {
    console.log(`[Sync] Starting sync for class ${classId} (User: ${userId}, Delete: ${isDelete})`);

    try {
        // 1. Fetch User's Google Tokens
        const userRef = adminFirestore.collection('users').doc(userId);
        const integrationRef = userRef.collection('integrations').doc('google');
        const integrationSnap = await integrationRef.get();

        if (!integrationSnap.exists || !integrationSnap.data()?.connected) {
            console.log(`[Sync] User ${userId} is not connected to Google Calendar.`);
            return { success: false, reason: "not_connected" };
        }

        const tokens = integrationSnap.data();
        const oauth2Client = getOAuth2Client();
        oauth2Client.setCredentials({
            access_token: tokens?.accessToken,
            refresh_token: tokens?.refreshToken
        });

        // 2. Fetch Class Details (if not deleting)
        const classRef = adminFirestore.collectionGroup('classes').where('__name__', '==', classId).limit(1);
        // Note: collectionGroup query by ID usually requires knowing the path, but __name__ works if unique enough or we iterate.
        // Actually, for multi-tenant, we might need the full path.
        // But wait, the client knows the full path? No, client just passes ID usually or we can find it.
        // BETTER: Retrieve the class using a direct path if possible. 
        // We don't easily know the Tenant ID here unless we pass it.
        // Let's assume we pass TenantID or we query by Owner logic (less efficient).
        // Let's UPDATE the signature to accept TenantID for efficiency.
        // Updating...

    } catch (error) {
        console.error("[Sync] Error:", error);
        return { success: false, error: String(error) };
    }
}

// Redefining with TenantID for direct access
export async function syncClassToGoogleAction(tenantId: string, userId: string, classId: string, isDelete: boolean = false) {
    console.log(`[GCal Sync] Started: Tenant=${tenantId}, User=${userId}, Class=${classId}, Delete=${isDelete}`);
    try {
        // 1. Fetch User's Google Tokens
        const integrationSnap = await adminFirestore.collection('users').doc(userId).collection('integrations').doc('google').get();

        if (!integrationSnap.exists || !integrationSnap.data()?.connected) {
            console.log(`[GCal Sync] User ${userId} has no Google integration.`);
            return { success: false, reason: "not_connected" };
        }

        const { accessToken, refreshToken } = integrationSnap.data() as any;
        const oauth2Client = getOAuth2Client();
        oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // 2. Access Firestore Class
        const classRef = adminFirestore.doc(`tenants/${tenantId}/classes/${classId}`);
        const classSnap = await classRef.get();

        if (!classSnap.exists && !isDelete) {
            console.error(`[GCal Sync] Class ${classId} not found in Firestore.`);
            return { success: false, error: "Class not found" };
        }

        const classData = classSnap.exists ? classSnap.data() : null;

        if (isDelete) {
            // Delete logic handled separately via deleteGoogleCalendarEvent usually, 
            // but we can support it here if we had the eventId
            console.warn(`[GCal Sync] Sync action called for delete but doc might be gone. Use deleteGoogleCalendarEvent instead.`);
            return { success: false, error: "Use deleteGoogleCalendarEvent for deletions" };
        }

        if (classData) {
            const start = classData.start instanceof Timestamp ? classData.start.toDate() : new Date(classData.start);
            const end = classData.end instanceof Timestamp ? classData.end.toDate() : new Date(classData.end);

            const eventBody = {
                summary: classData.title,
                description: classData.meetLink ? `Join: ${classData.meetLink}` : 'Managed by ChronoClass',
                start: { dateTime: start.toISOString() },
                end: { dateTime: end.toISOString() },
                location: classData.meetLink || '',
            };

            if (classData.googleEventId) {
                // Update
                console.log(`[GCal Sync] Updating existing event ${classData.googleEventId}`);
                try {
                    await calendar.events.update({
                        calendarId: 'primary',
                        eventId: classData.googleEventId,
                        requestBody: eventBody
                    });
                } catch (e: any) {
                    if (e.code === 404) {
                        console.log(`[GCal Sync] Event not found in GCal, recreating...`);
                        const res = await calendar.events.insert({ calendarId: 'primary', requestBody: eventBody });
                        await classRef.update({ googleEventId: res.data.id });
                    } else {
                        throw e;
                    }
                }
            } else {
                // Insert
                console.log(`[GCal Sync] Creating new GCal event`);
                const res = await calendar.events.insert({
                    calendarId: 'primary',
                    requestBody: eventBody
                });
                // Save Back ID
                await classRef.update({ googleEventId: res.data.id });
            }
        }

        return { success: true };

    } catch (error: any) {
        console.error("[GCal Sync] Action Failed:", error.message || error);
        return { success: false, error: String(error) };
    }
}

export async function deleteGoogleCalendarEvent(userId: string, googleEventId: string) {
    try {
        const integrationSnap = await adminFirestore.collection('users').doc(userId).collection('integrations').doc('google').get();
        if (!integrationSnap.exists || !integrationSnap.data()?.connected) return;

        const { accessToken, refreshToken } = integrationSnap.data() as any;
        const oauth2Client = getOAuth2Client();
        oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        await calendar.events.delete({
            calendarId: 'primary',
            eventId: googleEventId
        });
        return { success: true };
    } catch (error) {
        console.error("Delete Sync Failed", error);
        return { success: false };
    }
}
