'use server';

import { Resend } from 'resend';
import { adminFirestore } from '@/lib/firebase/admin-app';
import { FieldValue } from 'firebase-admin/firestore';
import { sanitizeString, sanitizeEmail, sanitizePhone } from '@/lib/sanitize';
import { z } from 'zod';
import { scoreLeadWithAI } from '@/ai/flows/lead-scoring';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@pertuto.com';

// ── Rate Limiting ──
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

async function checkRateLimit(identifier: string): Promise<boolean> {
  const now = Date.now();
  const limitRef = adminFirestore.collection('rateLimits').doc(identifier);
  
  try {
      const doc = await limitRef.get();
      if (!doc.exists) {
        await limitRef.set({ count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true;
      }
      
      const data = doc.data()!;
      if (now > data.resetAt) {
        await limitRef.set({ count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true;
      }
      
      if (data.count >= RATE_LIMIT_MAX) {
        return false;
      }
      
      await limitRef.update({ count: FieldValue.increment(1) });
      return true;
  } catch (err) {
      console.error("Rate limit check failed", err);
      return true; // fail-open
  }
}

// ── Validation Schema ──
const publicLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(7, "Phone must be at least 7 characters."),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  subject: z.string().max(150).optional(),
  packageParams: z.string().max(500).optional(),
});

export async function submitPublicLead(data: {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    packageParams?: string;
}) {
    try {
        // Strict Server-Side Validation
        const parsedData = publicLeadSchema.safeParse(data);
        if (!parsedData.success) {
            console.error("Validation failed:", parsedData.error.flatten());
            return { success: false, error: 'Invalid submission data.' };
        }

        const validData = parsedData.data;

        // Rate limit by a hash of name+phone (no IP available in server actions)
        const rateLimitKey = `${validData.name}-${validData.phone}`.toLowerCase().trim();
        if (!(await checkRateLimit(rateLimitKey))) {
            return { success: false, error: 'Too many submissions. Please try again later.' };
        }

        // Sanitize all inputs
        const sanitized = {
            name: sanitizeString(validData.name),
            phone: sanitizePhone(validData.phone),
            email: validData.email ? sanitizeEmail(validData.email) : '',
            subject: validData.subject ? sanitizeString(validData.subject) : '',
            packageParams: validData.packageParams ? sanitizeString(validData.packageParams) : '',
        };

        // ── AI Lead Scoring ──
        let aiScore = 50;
        let aiCategory = 'Warm';
        let aiReasoning = 'Manual analysis required.';

        try {
            const scoreResult = await scoreLeadWithAI({
                name: sanitized.name,
                subject: sanitized.subject,
                packageParams: sanitized.packageParams,
            });
            aiScore = scoreResult.score;
            aiCategory = scoreResult.category;
            aiReasoning = scoreResult.reasoning;
        } catch (e) {
            console.error("AI Scoring failed:", e);
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
            aiScore,
            aiCategory,
            aiReasoning,
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
                        <hr />
                        <p><strong>AI Rank:</strong> <span style="color: ${aiCategory === 'Hot' ? '#ef4444' : aiCategory === 'Warm' ? '#f59e0b' : '#3b82f6'}">${aiCategory} (${aiScore}/100)</span></p>
                        <p><strong>AI Reasoning:</strong> ${aiReasoning}</p>
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
