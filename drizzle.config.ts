import type { Config } from 'drizzle-kit'

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'tab-system',
    ssl:
      process.env.POSTGRES_SSL === 'true'
        ? { rejectUnauthorized: false }
        : false
  }
} satisfies Config
