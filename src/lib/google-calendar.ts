
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { firestore } from './firebase/client-app'; // WARNING: client-app is for client, we need admin for server-side or secure ops.
// Actually, since this is a Next.js app, we should use Server Actions + Firebase Admin SDK for secure token storage.
// For now, I'll stick to client-side Firestore for MVP if rules allow, BUT secrets must be server-side.
// We will use standard Next.js API Routes / Server Actions which run on server.

// Environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// Determine redirect URI based on environment
const REDIRECT_URI = process.env.NODE_ENV === 'production'
    ? 'https://pertuto.com/api/auth/google/callback'
    : 'http://localhost:3000/api/auth/google/callback';

export const getOAuth2Client = (): OAuth2Client => {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error('Missing Google OAuth Credentials');
    }

    return new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );
};

export const getAuthUrl = () => {
    const oauth2Client = getOAuth2Client();

    // Scopes for Calendar
    const scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
    ];


    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent' // Force consent to ensure we get refresh_token
    });
};
