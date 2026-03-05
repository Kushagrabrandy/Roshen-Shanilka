@echo off
SET "DATABASE_URL=postgresql://neondb_owner:npg_AR7Fj4iNrhgB@ep-gentle-smoke-ai5t4pev-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
echo Environment set.
npx prisma generate
npx prisma db seed
