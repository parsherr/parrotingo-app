/**
 * Auth Provider Interface
 *
 * This interface defines the contract for any authentication provider.
 * To add a new provider (e.g., GitHub, Apple), implement this interface
 * and register it in the AuthProviderRegistry.
 */

import { User } from '@prisma/client';

export interface AuthProviderResult {
    user: User;
    isNewUser: boolean;
}

export interface AuthProvider {
    /** Unique provider name (e.g., 'credentials', 'google') */
    readonly name: string;

    /**
     * Authenticate a user and return the user record.
     * For credentials: validates email/password.
     * For OAuth: validates the OAuth data and creates/finds user.
     */
    authenticate(data: Record<string, unknown>): Promise<AuthProviderResult>;
}

/**
 * Auth Provider Registry — plug-and-play architecture.
 * Register new providers here to extend auth capabilities.
 */
export class AuthProviderRegistry {
    private providers = new Map<string, AuthProvider>();

    register(provider: AuthProvider): void {
        this.providers.set(provider.name, provider);
    }

    get(name: string): AuthProvider | undefined {
        return this.providers.get(name);
    }

    has(name: string): boolean {
        return this.providers.has(name);
    }

    list(): string[] {
        return Array.from(this.providers.keys());
    }
}

// Singleton registry
export const authProviderRegistry = new AuthProviderRegistry();
