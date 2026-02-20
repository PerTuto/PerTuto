
import { NextRequest, NextResponse } from 'next/server';
import { getOAuth2Client } from '@/lib/google-calendar';
import { adminFirestore } from '@/lib/firebase/server-app';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.json({ error }, { status: 400 });
    }

    if (!code || !state) {
        return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
    }

    try {
        // Decode state to get UID
        const decodedState = Buffer.from(state, 'base64').toString('ascii');
        const { uid } = JSON.parse(decodedState);

        if (!uid) {
            return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
        }

        const client = getOAuth2Client();
        const { tokens } = await client.getToken(code);

        if (!tokens.refresh_token) {
            // This happens if user has already granted access and we didn't prompt=consent.
            // We set prompt=consent in signin, so we should get it.
            console.warn('No refresh token received. User might need to revoke access to get a new one.');
        }

        // securely store tokens in Firestore (Admin)
        // Storing in a sub-collection 'integrations' -> 'google'
        await adminFirestore.collection('users').doc(uid).collection('integrations').doc('google').set({
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token || null, // Important: might be null on subsequent auths
            expiryDate: tokens.expiry_date,
            updatedAt: new Date(),
            connected: true
        }, { merge: true });

        // Redirect back to app settings or schedule
        // Assuming app is at root
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
        return NextResponse.redirect(`${baseUrl}/schedule?google_connected=true`);

    } catch (err) {
        console.error('OAuth Callback Error:', err);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
