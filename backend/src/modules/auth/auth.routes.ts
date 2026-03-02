/**
 * Auth Routes
 *
 * API endpoints for authentication.
 *
 * POST /api/auth/credentials/login  — Login with email/password
 * POST /api/auth/credentials/signup — Register with email/password
 * POST /api/auth/google             — Google OAuth login
 * GET  /api/auth/me                 — Get current user
 * POST /api/auth/logout             — Logout (clear cookie)
 * PUT  /api/auth/profile            — Update user profile
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authService } from './auth.service.js';
import { authMiddleware } from '../../middleware/auth.js';
import { env } from '../../config/env.js';

// Validation schemas
const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(1, 'Name is required').optional(),
});

const googleSchema = z.object({
    credential: z.string().min(1, 'Google credential is required'),
});

const profileSchema = z.object({
    name: z.string().min(1).optional(),
    avatarUrl: z.string().url().optional(),
});

function setTokenCookie(reply: any, token: string) {
    reply.setCookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
    // ─── Login with credentials ───
    app.post('/credentials/login', async (request, reply) => {
        try {
            const body = loginSchema.parse(request.body);

            const result = await authService.authenticate('credentials', {
                ...body,
                action: 'login',
            });

            setTokenCookie(reply, result.token);

            return reply.send({
                success: true,
                data: result,
            });
        } catch (error: any) {
            const statusCode = error.name === 'ZodError' ? 400 : 401;
            return reply.status(statusCode).send({
                success: false,
                error: error.name === 'ZodError'
                    ? error.errors.map((e: any) => e.message).join(', ')
                    : error.message,
            });
        }
    });

    // ─── Signup with credentials ───
    app.post('/credentials/signup', async (request, reply) => {
        try {
            const body = signupSchema.parse(request.body);

            const result = await authService.authenticate('credentials', {
                ...body,
                action: 'signup',
            });

            setTokenCookie(reply, result.token);

            return reply.status(201).send({
                success: true,
                data: result,
            });
        } catch (error: any) {
            const statusCode = error.name === 'ZodError' ? 400 : 409;
            return reply.status(statusCode).send({
                success: false,
                error: error.name === 'ZodError'
                    ? error.errors.map((e: any) => e.message).join(', ')
                    : error.message,
            });
        }
    });

    // ─── Google OAuth ───
    app.post('/google', async (request, reply) => {
        try {
            const body = googleSchema.parse(request.body);

            const result = await authService.authenticate('google', body);

            setTokenCookie(reply, result.token);

            return reply.send({
                success: true,
                data: result,
            });
        } catch (error: any) {
            const statusCode = error.name === 'ZodError' ? 400 : 401;
            return reply.status(statusCode).send({
                success: false,
                error: error.name === 'ZodError'
                    ? error.errors.map((e: any) => e.message).join(', ')
                    : error.message,
            });
        }
    });

    // ─── Get current user ───
    app.get('/me', { preHandler: authMiddleware }, async (request, reply) => {
        try {
            const user = await authService.getCurrentUser(request.userId!);

            if (!user) {
                return reply.status(404).send({
                    success: false,
                    error: 'User not found',
                });
            }

            return reply.send({
                success: true,
                data: { user },
            });
        } catch (error: any) {
            return reply.status(500).send({
                success: false,
                error: error.message,
            });
        }
    });

    // ─── Update profile ───
    app.put('/profile', { preHandler: authMiddleware }, async (request, reply) => {
        try {
            const body = profileSchema.parse(request.body);

            const user = await authService.updateProfile(request.userId!, body);

            return reply.send({
                success: true,
                data: { user },
            });
        } catch (error: any) {
            const statusCode = error.name === 'ZodError' ? 400 : 500;
            return reply.status(statusCode).send({
                success: false,
                error: error.name === 'ZodError'
                    ? error.errors.map((e: any) => e.message).join(', ')
                    : error.message,
            });
        }
    });

    // ─── Logout ───
    app.post('/logout', async (_request, reply) => {
        reply.clearCookie('token', { path: '/' });

        return reply.send({
            success: true,
            data: { message: 'Logged out successfully' },
        });
    });

    // ─── List available providers ───
    app.get('/providers', async (_request, reply) => {
        const { authProviderRegistry } = await import('../../providers/auth-provider.js');

        return reply.send({
            success: true,
            data: { providers: authProviderRegistry.list() },
        });
    });
}
