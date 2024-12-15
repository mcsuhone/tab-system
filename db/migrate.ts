import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'tab-system',
  ssl:
    process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false
})

const db = drizzle(pool, { schema })

async function main() {
  console.log('Starting migration...')
  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('Migration completed!')
  await pool.end()
}

main().catch((err) => {
  console.error('Migration failed!', err)
  process.exit(1)
})
