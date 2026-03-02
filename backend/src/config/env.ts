import 'dotenv/config';

export const env = {
    PORT: parseInt(process.env.PORT || '4000', 10),
    DATABASE_URL: process.env.DATABASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
} as const;
