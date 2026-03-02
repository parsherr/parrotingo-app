-- ============================================
-- Parrotingo Database Initialization Script
-- ============================================
-- Bu scripti çalıştırmadan önce PostgreSQL'in çalıştığından emin ol:
--   sudo systemctl start postgresql
--
-- Çalıştırma:
--   sudo -u postgres psql -f backend/scripts/init-db.sql
-- ============================================

-- 1. pg_hba.conf'u md5 auth'a çevir (password ile bağlanabilmek için)
-- NOT: Bu SQL ile yapılamaz, aşağıdaki shell scriptini kullan.

-- 2. Kullanıcı oluştur
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'parrotingo') THEN
        CREATE ROLE parrotingo WITH LOGIN PASSWORD 'postgres' CREATEDB;
        RAISE NOTICE 'User "parrotingo" created.';
    ELSE
        RAISE NOTICE 'User "parrotingo" already exists, skipping.';
    END IF;
END
$$;

-- 3. Veritabanı oluştur
SELECT 'CREATE DATABASE parrotingo OWNER parrotingo'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'parrotingo');
\gexec

-- 4. Bağlantı yetkisi ver
GRANT ALL PRIVILEGES ON DATABASE parrotingo TO parrotingo;

-- Done!
\echo '✅ Database "parrotingo" and user "parrotingo" are ready!'
