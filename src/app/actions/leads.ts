'use server';

import { Resend } from 'resend';
import { adminFirestore } from '@/lib/firebase/admin-app';
import { FieldValue } from 'firebase-admin/firestore';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@pertuto.com';

export async function submitPublicLead(data: {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    packageParams?: string;
}) {
    try {
        // 1. Write the lead to Firestore using Admin SDK
        const leadsRef = adminFirestore.collection('tenants/pertuto-default/leads');
        const docRef = await leadsRef.add({
            ...data,
            source: 'website',
            status: 'New',
            dateAdded: FieldValue.serverTimestamp(),
        });

        // 2. Fire the Resend Email Notification safely on the server
        if (process.env.RESEND_API_KEY) {
            try {
                await resend.emails.send({
                    from: 'PerTuto Leads <onboarding@resend.dev>',
                    to: ADMIN_EMAIL,
                    subject: `🚨 New Lead: ${data.name} - ${data.subject || 'General Inquiry'}`,
                    html: `
                        <h2>New Lead from PerTuto.com</h2>
                        <p><strong>Name:</strong> ${data.name}</p>
                        <p><strong>Phone:</strong> ${data.phone}</p>
                        <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
                        <p><strong>Subject/Interest:</strong> ${data.subject || 'N/A'}</p>
                        <p><strong>Package Interest:</strong> ${data.packageParams || 'N/A'}</p>
                        <p><a href="https://pertuto.com/dashboard/leads">View in Dashboard</a></p>
                    `,
                });
            } catch (emailErr) {
                // Don't fail the lead submission if email fails
                console.error('Email notification failed (non-blocking):', emailErr);
            }
        }

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error submitting public lead:', error);
        return { success: false, error: 'Failed to submit lead' };
    }
}
