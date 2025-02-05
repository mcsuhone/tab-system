'use server'

import { verifyCredentials } from '@/lib/auth'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { db } from '@/db/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'

export async function login(
  memberNo: string,
  password: string,
  rememberMe: boolean
) {
  try {
    if (!memberNo) {
      return false
    }

    const isValid = await verifyCredentials(memberNo, password)

    if (!isValid) {
      return false
    }

    // Get user data including permission
    const user = await db
      .select({
        memberNo: users.member_no,
        permission: users.permission
      })
      .from(users)
      .where(eq(users.member_no, memberNo))
      .limit(1)

    if (!user[0]) return false

    // Create JWT token with permission
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = await new SignJWT({
      memberNo: user[0].memberNo,
      permission: user[0].permission,
      rememberMe: rememberMe
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(secret)

    // Set cookie with domain and path
    cookies().set('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 86400 * 165 // 1 day
    })

    return true
  } catch (error) {
    console.error('Login error:', error)
    return false
  }
}

export async function logout(): Promise<void> {
  cookies().delete('token')
}

export async function checkAdminStatus(): Promise<boolean> {
  try {
    const { user } = await auth()
    return user?.permission === 'admin' || false
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}
