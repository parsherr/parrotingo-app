/**
 * Auth Service
 *
 * Business logic layer for authentication.
 * Delegates to auth providers and handles token generation.
 */

import { prisma } from '../../config/prisma.js';
import { authProviderRegistry } from '../../providers/auth-provider.js';
import { signToken } from '../../utils/jwt.js';

import type { User } from '@prisma/client';

export interface AuthResponse {
    user: SafeUser;
    token: string;
    isNewUser: boolean;
}

export type SafeUser = Omit<User, 'passwordHash'>;

function sanitizeUser(user: User): SafeUser {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
}

export class AuthService {
    /**
     * Authenticate using a registered provider.
     */
    async authenticate(
        providerName: string,
        data: Record<string, unknown>
    ): Promise<AuthResponse> {
        const provider = authProviderRegistry.get(providerName);

        if (!provider) {
            throw new Error(`Auth provider '${providerName}' is not registered`);
        }

        const { user, isNewUser } = await provider.authenticate(data);
        const token = signToken({ userId: user.id, email: user.email });

        return {
            user: sanitizeUser(user),
            token,
            isNewUser,
        };
    }

    /**
     * Get current user by ID.
     */
    async getCurrentUser(userId: string): Promise<SafeUser | null> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        return user ? sanitizeUser(user) : null;
    }

    /**
     * Update user profile.
     */
    async updateProfile(
        userId: string,
        data: { name?: string; avatarUrl?: string }
    ): Promise<SafeUser> {
        const user = await prisma.user.update({
            where: { id: userId },
            data,
        });

        return sanitizeUser(user);
    }
}

export const authService = new AuthService();
