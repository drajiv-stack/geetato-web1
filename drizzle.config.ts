import { defineConfig } from 'drizzle-kit';
import type { Config } from 'drizzle-kit';

const url = process.env.TURSO_CONNECTION_URL!;
const isLocalFile = url?.startsWith('file:');

const dbConfig: Config = defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: isLocalFile
    ? { url }
    : {
        url,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      },
});

export default dbConfig;
