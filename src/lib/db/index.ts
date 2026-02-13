import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Database connection for serverless (Vercel + Neon)
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/athlo';

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });

export * from './schema';
