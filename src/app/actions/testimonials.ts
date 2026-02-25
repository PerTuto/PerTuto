'use server';

import { adminFirestore } from '@/lib/firebase/admin-app';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

// ── Rate Limiting ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

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

// ── Validation ──
const testimonialSchema = z.object({
  tenantId: z.string().min(1, "Tenant ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.string().min(2, "Role must be at least 2 characters").max(150),
  quote: z.string().min(10, "Please provide at least 10 characters").max(1000),
  rating: z.number().int().min(1).max(5),
});

export async function submitTestimonial(formData: {
  tenantId: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Rate limit by tenant
    if (!checkRateLimit(`testimonial_${formData.tenantId}`)) {
      return { success: false, error: "Too many submissions. Please try again later." };
    }

    // Validate
    const validation = testimonialSchema.safeParse(formData);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    const { tenantId, name, role, quote, rating } = validation.data;

    // Verify tenant exists
    const tenantDoc = await adminFirestore.doc(`tenants/${tenantId}`).get();
    if (!tenantDoc.exists) {
      return { success: false, error: "Organization not found." };
    }

    // Save testimonial with pending status
    await adminFirestore.collection(`tenants/${tenantId}/testimonials`).add({
      tenantId,
      name: name.trim(),
      role: role.trim(),
      quote: quote.trim(),
      rating,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting testimonial:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
