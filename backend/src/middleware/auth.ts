/**
 * Auth Middleware
 *
 * Extracts and verifies JWT from Authorization header or cookie.
 * Attaches user info to the request object.
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/jwt.js';

declare module 'fastify' {
    interface FastifyRequest {
        userId?: string;
        userEmail?: string;
    }
}

export async function authMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    try {
        // Try Authorization header first
        let token = request.headers.authorization?.replace('Bearer ', '');

        // Fallback to cookie
        if (!token) {
            token = (request.cookies as Record<string, string>)?.token;
        }

        if (!token) {
            reply.status(401).send({ error: 'Authentication required' });
            return;
        }

        const payload = verifyToken(token);
        request.userId = payload.userId;
        request.userEmail = payload.email;
    } catch {
        reply.status(401).send({ error: 'Invalid or expired token' });
    }
}
