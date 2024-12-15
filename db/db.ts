import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema'

dotenv.config()

const pool = new pg.Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'tab-system',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl:
    process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false
})

export const db = drizzle(pool, { schema })
