import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  // Supabase / production: set DATABASE_URL for a single connection string.
  // Local dev fallback: use individual host/port/name/user/password vars.
  url:      process.env.DATABASE_URL,
  host:     process.env.DB_HOST     ?? 'localhost',
  port:     parseInt(process.env.DB_PORT ?? '5432', 10),
  name:     process.env.DB_NAME     ?? 'vedarogya',
  user:     process.env.DB_USER     ?? 'postgres',
  password: process.env.DB_PASSWORD,
  // HIPAA: SSL required in production for data in transit encryption.
  ssl:      process.env.DB_SSL !== 'false', // defaults to true
}));
