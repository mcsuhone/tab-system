'use server'

import { verifyCredentials } from '@/lib/auth'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

export async function login(memberNo: string, password: string) {
  try {
    if (!memberNo) {
      console.log('No member number provided')
      return false
    }

    console.log('Attempting login with:', {
      memberNo,
      password: password ? '[PROVIDED]' : '[EMPTY]'
    })

    const isValid = await verifyCredentials(memberNo, password)
    console.log('Credentials verification result:', isValid)

    if (!isValid) {
      console.log('Invalid credentials')
      return false
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = await new SignJWT({ memberNo })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(secret)

    // Set cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
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
