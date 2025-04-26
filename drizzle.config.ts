import type { Config } from 'drizzle-kit'
import { dbCredentials, validateAndLoadDbCredentials } from './config/db-config'

// Validate credentials specifically for drizzle-kit context
validateAndLoadDbCredentials('drizzle-kit')

// We can assert non-null here because validateAndLoadDbCredentials throws if they are missing
const { host, user, password, database, port, ssl } = dbCredentials

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: host!,
    user: user!,
    password: password!,
    database: database!,
    port: parseInt(port || '5432'),
    ssl: ssl === 'true' ? { rejectUnauthorized: false } : false
  }
} satisfies Config
