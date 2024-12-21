'use server'

import { verifyCredentials } from '@/lib/auth'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { db } from '@/db/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'

export async function login(memberNo: string, password: string) {
  try {
    console.log('Login attempt:', { memberNo })

    if (!memberNo) {
      console.log('No member number provided')
      return false
    }

    console.log('Verifying credentials...')
    const isValid = await verifyCredentials(memberNo, password)
    console.log('Credentials verification result:', isValid)

    if (!isValid) {
      console.log('Invalid credentials')
      return false
    }

    console.log('Getting user data...')
    // Get user data including permission
    const user = await db
      .select({
        memberNo: users.member_no,
        permission: users.permission
      })
      .from(users)
      .where(eq(users.member_no, memberNo))
      .limit(1)

    console.log('User data:', user[0])

    if (!user[0]) return false

    console.log('Creating JWT token...')
    // Create JWT token with permission
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = await new SignJWT({
      memberNo: user[0].memberNo,
      permission: user[0].permission
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(secret)

    console.log('Setting cookie...')
    // Set cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 * 165 // 1 day
    })

    console.log('Login successful')
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
