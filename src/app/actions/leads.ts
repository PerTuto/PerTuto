'use server';

import { Resend } from 'resend';
import { adminFirestore } from '@/lib/firebase/admin-app';
import { FieldValue } from 'firebase-admin/firestore';
import { sanitizeString, sanitizeEmail, sanitizePhone } from '@/lib/sanitize';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@pertuto.com';

// ── Rate Limiting ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

export async function submitPublicLead(data: {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    packageParams?: string;
}) {
    try {
        // Rate limit by a hash of name+phone (no IP available in server actions)
        const rateLimitKey = `${data.name}-${data.phone}`.toLowerCase().trim();
        if (!checkRateLimit(rateLimitKey)) {
            return { success: false, error: 'Too many submissions. Please try again later.' };
        }

        // Sanitize all inputs
        const sanitized = {
            name: sanitizeString(data.name),
            phone: sanitizePhone(data.phone),
            email: data.email ? sanitizeEmail(data.email) : '',
            subject: data.subject ? sanitizeString(data.subject) : '',
            packageParams: data.packageParams ? sanitizeString(data.packageParams) : '',
        };

        // Validate required fields
        if (!sanitized.name || sanitized.name.length < 2) {
            return { success: false, error: 'Please provide a valid name.' };
        }
        if (!sanitized.phone || sanitized.phone.length < 7) {
            return { success: false, error: 'Please provide a valid phone number.' };
        }

        // 1. Write the lead to Firestore using Admin SDK
        const leadsRef = adminFirestore.collection('tenants/pertuto-default/leads');
        const docRef = await leadsRef.add({
            name: sanitized.name,
            phone: sanitized.phone,
            email: sanitized.email,
            subject: sanitized.subject,
            packageParams: sanitized.packageParams,
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
                    subject: `🚨 New Lead: ${sanitized.name} - ${sanitized.subject || 'General Inquiry'}`,
                    html: `
                        <h2>New Lead from PerTuto.com</h2>
                        <p><strong>Name:</strong> ${sanitized.name}</p>
                        <p><strong>Phone:</strong> ${sanitized.phone}</p>
                        <p><strong>Email:</strong> ${sanitized.email || 'N/A'}</p>
                        <p><strong>Subject/Interest:</strong> ${sanitized.subject || 'N/A'}</p>
                        <p><strong>Package Interest:</strong> ${sanitized.packageParams || 'N/A'}</p>
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
