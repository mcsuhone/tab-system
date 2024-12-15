import bcrypt from 'bcryptjs'
import { db } from '@/db/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function verifyCredentials(username: string, password: string) {
  // Find user
  const user = await db
    .select()
    .from(users)
    .where(eq(users.name, username))
    .execute()

  if (user.length === 0) {
    return false
  }

  // If password is empty in DB and provided password is empty
  if (!user[0].password && !password) {
    return true
  }

  // Verify password
  return await bcrypt.compare(password, user[0].password)
}
