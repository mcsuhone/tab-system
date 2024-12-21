import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db } from './db'
import { users } from './schema'

const DEFAULT_ADMIN_USERNAME = 'admin'

async function main() {
  console.log('Starting migration...')
  try {
    await migrate(db, { migrationsFolder: 'drizzle' })
    console.log('Migration completed!')

    // Check if root user exists
    const existingRoot = await db
      .select()
      .from(users)
      .where(eq(users.name, DEFAULT_ADMIN_USERNAME))
      .execute()

    if (existingRoot.length === 0) {
      console.log(
        '\nNo root user found. Creating root user from environment variables...'
      )
      const username = process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME
      const password = process.env.ADMIN_PASSWORD

      if (!password) {
        throw new Error(
          'ADMIN_PASSWORD environment variable is required for first run'
        )
      }

      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(password, 10)

      await db
        .insert(users)
        .values({
          name: username,
          password: hashedPassword,
          balance: 0,
          member_no: '0',
          permission: 'admin'
        })
        .execute()

      console.log('Root user created successfully!')
    }
  } catch (error) {
    console.error('Error during migration:', error)
    throw error
  }
}

// Export for use in other files
export const runMigrations = main

// Run migrations immediately
console.log('Migration script started')
main().catch((err) => {
  console.error('Migration failed!', err)
  process.exit(1)
})
