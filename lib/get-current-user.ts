import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { db } from '@/db/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { User } from '@/db/schema'

export async function getCurrentUser(): Promise<User | null> {
  try {
    // Get token from cookies
    const token = cookies().get('token')
    if (!token) {
      return null
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token.value, secret)

    if (!payload.username) {
      return null
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
      return null
    }

    return user as User
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}
