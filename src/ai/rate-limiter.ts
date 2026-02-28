import { adminFirestore } from '@/lib/firebase/server-app';
import { headers } from 'next/headers';

const RATE_LIMIT_MAX = 10; // Max 10 requests
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // Per 1 hour

/**
 * Validates if the current request IP has exceeded the AI flow rate limit.
 * Uses Firestore for distributed token bucket / window tracking.
 */
export async function checkAIRateLimit(): Promise<boolean> {
    try {
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown-ip';
        
        // Strip out potential internal IPs or ports, just get the first raw IP string
        const cleanIp = ip.split(',')[0].trim().replace(/\./g, '_').replace(/:/g, '_');
        
        const ref = adminFirestore.collection('ai_rate_limits').doc(cleanIp);
        const doc = await ref.get();
        const now = Date.now();

        if (!doc.exists) {
            await ref.set({ count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
            return true;
        }

        const data = doc.data()!;
        
        // Window expired, reset it
        if (now > data.resetAt) {
            await ref.set({ count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
            return true;
        }

        // Limit exceeded
        if (data.count >= RATE_LIMIT_MAX) {
            return false;
        }

        // Increment usage
        await ref.update({ count: data.count + 1 });
        return true;
    } catch (error) {
        console.error("Rate limiting error:", error);
        // Fail open if Firestore is down, to not break the app functionality
        return true;
    }
}
