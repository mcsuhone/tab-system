import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema'
import {
  dbCredentials,
  validateAndLoadDbCredentials
} from '../config/db-config'

// Validate credentials specifically for db connection context
validateAndLoadDbCredentials('db connection')

// We can assert non-null here because validateAndLoadDbCredentials throws if they are missing
const { host, user, password, database, port, ssl } = dbCredentials

const pool = new pg.Pool({
  host: host!,
  user: user!,
  password: password!,
  database: database!,
  port: parseInt(port || '5432'), // Default port if not set
  ssl: ssl === 'true' ? { rejectUnauthorized: false } : false
})

export const db = drizzle(pool, { schema })
