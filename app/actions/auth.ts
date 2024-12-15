'use server'

import { verifyCredentials } from '@/lib/auth'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

export async function login(username: string, password: string) {
  try {
    const isValid = await verifyCredentials(username, password)
    if (!isValid) {
      return false
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(secret)

    // Set cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 1 day
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
