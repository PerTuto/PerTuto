/**
 * Input sanitization utilities for server-side form processing.
 * Strips HTML tags, trims whitespace, and validates common formats.
 */

/** Strip HTML tags and trim whitespace */
export function sanitizeString(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '')   // Remove HTML tags
    .replace(/&[a-z]+;/gi, '') // Remove HTML entities
    .trim();
}

/** Sanitize and validate email format */
export function sanitizeEmail(input: string | undefined | null): string {
  const cleaned = sanitizeString(input).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned) ? cleaned : '';
}

/** Sanitize phone number — keep only digits, +, -, spaces, parens */
export function sanitizePhone(input: string | undefined | null): string {
  if (!input) return '';
  return input.replace(/[^\d+\-\s()]/g, '').trim();
}

/** Sanitize an object's string values */
export function sanitizeLeadInput(data: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      if (key === 'email') {
        result[key] = sanitizeEmail(value);
      } else if (key === 'phone') {
        result[key] = sanitizePhone(value);
      } else {
        result[key] = sanitizeString(value);
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}
