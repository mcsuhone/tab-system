import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { users } from './schema'
import { eq } from 'drizzle-orm'
import { db } from './db'
import readline from 'readline'
import bcrypt from 'bcryptjs'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('Starting migration...')
  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('Migration completed!')

  // Check if root user exists
  const existingRoot = await db
    .select()
    .from(users)
    .where(eq(users.name, 'root'))
    .execute()

  if (existingRoot.length === 0) {
    console.log('\nNo root user found. Creating root user...')
    const username =
      (await question('Enter root username (default: root): ')) || 'root'
    const password =
      (await question('Enter root password (can be empty): ')) || ''

    // Hash the password before storing
    const hashedPassword = password ? await bcrypt.hash(password, 10) : ''

    await db
      .insert(users)
      .values({
        name: username,
        password: hashedPassword,
        balance: 0,
        member_no: '0'
      })
      .execute()

    console.log('Root user created successfully!')
  }

  rl.close()
}

main().catch((err) => {
  console.error('Migration failed!', err)
  process.exit(1)
})
