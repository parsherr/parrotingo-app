/**
 * Google Auth Provider
 *
 * Handles Google OAuth authentication.
 * Verifies the Google ID token and creates/finds the user.
 */

import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import type { AuthProvider, AuthProviderResult } from './auth-provider.js';

interface GoogleTokenPayload {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
    email_verified?: boolean;
}

export class GoogleProvider implements AuthProvider {
    readonly name = 'google';

    async authenticate(data: Record<string, unknown>): Promise<AuthProviderResult> {
        const { credential } = data as { credential: string };

        // Verify Google token by calling Google's tokeninfo endpoint
        const payload = await this.verifyGoogleToken(credential);

        if (!payload.email) {
            throw new Error('Google account does not have an email address');
        }

        // Check if user already exists
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: payload.email },
                    { provider: 'GOOGLE', providerId: payload.sub },
                ],
            },
        });

        if (user) {
            // Update avatar and name if changed
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    avatarUrl: payload.picture || user.avatarUrl,
                    name: payload.name || user.name,
                    provider: 'GOOGLE',
                    providerId: payload.sub,
                },
            });

            return { user, isNewUser: false };
        }

        // Create new user
        user = await prisma.user.create({
            data: {
                email: payload.email,
                name: payload.name || payload.email.split('@')[0],
                avatarUrl: payload.picture,
                provider: 'GOOGLE',
                providerId: payload.sub,
            },
        });

        return { user, isNewUser: true };
    }

    private async verifyGoogleToken(token: string): Promise<GoogleTokenPayload> {
        try {
            // Use Google's OAuth2 tokeninfo endpoint to verify
            const response = await fetch(
                `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
            );

            if (!response.ok) {
                throw new Error('Invalid Google token');
            }

            const payload = await response.json() as GoogleTokenPayload;

            // Verify audience matches our client ID
            const aud = (payload as unknown as Record<string, string>).aud;
            if (env.GOOGLE_CLIENT_ID && aud !== env.GOOGLE_CLIENT_ID) {
                throw new Error('Token audience mismatch');
            }

            return payload;
        } catch {
            throw new Error('Failed to verify Google token');
        }
    }
}
