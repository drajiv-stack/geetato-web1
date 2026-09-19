import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

const url = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const isLocalFile = url?.startsWith('file:');

if (!url) {
  throw new Error('TURSO_CONNECTION_URL is not defined in environment variables');
}

// Local SQLite files don't need an auth token.
const client = createClient(
  isLocalFile
    ? { url }
    : { url, authToken: authToken! }
);

export const db = drizzle(client, { schema });

export type Database = typeof db;
