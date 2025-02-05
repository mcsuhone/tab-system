import bcrypt from 'bcryptjs'
import { db } from '@/db/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { User } from '@/db/schema'

const passwordIsEmpty = (password: string) => {
  return !password || password === ''
}

export async function verifyCredentials(memberNo: string, password: string) {
  try {
    // Find user by member_no instead of name
    const user = await db
      .select()
      .from(users)
      .where(eq(users.member_no, memberNo))
      .execute()

    if (user.length === 0) {
      return false
    }

    // If password is empty in DB and provided password is empty
    if (passwordIsEmpty(user[0].password) && passwordIsEmpty(password)) {
      return true
    }

    // If password is empty in DB but password was provided, or vice versa
    if (passwordIsEmpty(user[0].password) || passwordIsEmpty(password)) {
      return false
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user[0].password)
    return isValid
  } catch (error) {
    console.error('Error in verifyCredentials:', error)
    return false
  }
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
    try {
      const { payload } = await jwtVerify(token.value, secret)

      if (!payload.memberNo) {
        return { user: null }
      }

      // Get user from database with transactions
      const user = await db.query.users.findFirst({
        where: eq(users.member_no, payload.memberNo as string),
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
    } catch (jwtError) {
      // Token is invalid or expired, return null user without throwing
      return { user: null }
    }
  } catch (error) {
    console.error('Auth error:', error)
    return { user: null }
  }
}
