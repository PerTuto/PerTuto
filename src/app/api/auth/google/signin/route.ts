
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const uid = searchParams.get('uid'); // Passing UID from client for MVP state

    if (!uid) {
        return NextResponse.json({ error: 'Missing UID' }, { status: 400 });
    }

    // Security: In a real app, sign this state or store in DB to prevent CSRF.
    // For MVP, we trust the flow initiated by the authenticated client.
    const state = JSON.stringify({ uid, nonce: Math.random().toString(36).substring(7) });
    const encodedState = Buffer.from(state).toString('base64');

    const authUrl = getAuthUrl();
    // Append state manually since our helper might not expose it easily or we rebuild it.
    // Actually, getAuthUrl uses generic generateAuthUrl. We can't easily append state if we didn't pass it.
    // Let's modify getAuthUrl in lib if needed, or just append `&state=...` here?
    // generateAuthUrl supports state. Let's update `lib/google-calendar.ts` first, OR just recreate the client here.

    // Re-creating client here to pass state cleanly
    const { getOAuth2Client } = await import('@/lib/google-calendar'); // Dynamic import to avoid env issues at build time if possible
    const client = getOAuth2Client();

    const scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
    ];


    const url = client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
        state: encodedState
    });

    return NextResponse.redirect(url);
}
