/**
 * Parrotingo Backend Server
 *
 * Fastify server with modular auth system, CORS, cookies, and PostgreSQL.
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { env } from './config/env.js';
import { registerProviders } from './providers/index.js';
import { authRoutes } from './modules/auth/auth.routes.js';

async function bootstrap() {
    const app = Fastify({
        logger: true,
    });

    // ─── Plugins ───
    await app.register(cors, {
        origin: env.FRONTEND_URL,
        credentials: true,
    });

    await app.register(cookie, {
        secret: env.JWT_SECRET,
    });

    // ─── Register Auth Providers ───
    registerProviders();

    // ─── Routes ───
    app.register(authRoutes, { prefix: '/api/auth' });

    // ─── Health Check ───
    app.get('/api/health', async () => ({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    }));

    // ─── Start Server ───
    try {
        await app.listen({ port: env.PORT, host: '0.0.0.0' });
        console.log(`\n🚀 Parrotingo Backend running on http://localhost:${env.PORT}`);
        console.log(`📡 API Base: http://localhost:${env.PORT}/api`);
        console.log(`💚 Health Check: http://localhost:${env.PORT}/api/health\n`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

bootstrap();
