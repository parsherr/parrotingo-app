/**
 * Credentials Auth Provider
 *
 * Handles email/password login & signup.
 * Passwords are hashed with bcrypt before storing in the database.
 */

import { prisma } from '../config/prisma.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import type { AuthProvider, AuthProviderResult } from './auth-provider.js';

export class CredentialsProvider implements AuthProvider {
    readonly name = 'credentials';

    async authenticate(data: Record<string, unknown>): Promise<AuthProviderResult> {
        const { email, password, name, action } = data as {
            email: string;
            password: string;
            name?: string;
            action: 'login' | 'signup';
        };

        if (action === 'signup') {
            return this.signup(email, password, name);
        }

        return this.login(email, password);
    }

    private async login(email: string, password: string): Promise<AuthProviderResult> {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (!user.passwordHash) {
            throw new Error(
                'This account was created with a social login. Please use that method to sign in.'
            );
        }

        const isValid = await comparePassword(password, user.passwordHash);
        if (!isValid) {
            throw new Error('Invalid email or password');
        }

        return { user, isNewUser: false };
    }

    private async signup(
        email: string,
        password: string,
        name?: string
    ): Promise<AuthProviderResult> {
        const existing = await prisma.user.findUnique({ where: { email } });

        if (existing) {
            throw new Error('An account with this email already exists');
        }

        const passwordHash = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                name: name || email.split('@')[0],
                passwordHash,
                provider: 'CREDENTIALS',
            },
        });

        return { user, isNewUser: true };
    }
}
