import bcrypt from 'bcryptjs'
import { db } from '@/db/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { User } from '@/db/schema'

export async function verifyCredentials(memberNo: string, password: string) {
  try {
    console.log('Finding user by member_no:', memberNo)
    // Find user by member_no instead of name
    const user = await db
      .select()
      .from(users)
      .where(eq(users.member_no, memberNo))
      .execute()

    console.log('User found:', user.length > 0)

    if (user.length === 0) {
      console.log('User not found with member_no:', memberNo)
      return false
    }

    // If password is empty in DB and provided password is empty
    if (!user[0].password && !password) {
      console.log('Empty password login successful')
      return true
    }

    // If password is empty in DB but password was provided, or vice versa
    if (!user[0].password || !password) {
      console.log('Password mismatch: one empty, one provided')
      return false
    }

    console.log('Verifying password...')
    // Verify password
    const isValid = await bcrypt.compare(password, user[0].password)
    console.log('Password verification result:', isValid)
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
