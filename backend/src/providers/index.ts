/**
 * Provider Registration
 *
 * Register all auth providers here.
 * To add a new provider: create a new provider class that implements AuthProvider,
 * then register it in this file.
 */

import { authProviderRegistry } from './auth-provider.js';
import { CredentialsProvider } from './credentials.provider.js';
import { GoogleProvider } from './google.provider.js';

export function registerProviders(): void {
    authProviderRegistry.register(new CredentialsProvider());
    authProviderRegistry.register(new GoogleProvider());

    console.log(
        `✅ Auth providers registered: [${authProviderRegistry.list().join(', ')}]`
    );
}
