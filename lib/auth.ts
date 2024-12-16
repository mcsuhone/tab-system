import bcrypt from 'bcryptjs'
import { db } from '@/db/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { User } from '@/db/schema'

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

export async function auth(): Promise<{ user: User | null }> {
  try {
    // Get token from cookies
    const token = cookies().get('token')
    if (!token) {
      return { user: null }
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token.value, secret)

    if (!payload.username) {
      return { user: null }
    }

    // Get user from database with transactions
    const user = await db.query.users.findFirst({
      where: eq(users.name, payload.username as string),
      with: {
        transactions: {
          with: {
            product: true
          }
        }
      }
    })

    if (!user) {
      return { user: null }
    }

    return { user: user as User }
  } catch (error) {
    console.error('Auth error:', error)
    return { user: null }
  }
}
