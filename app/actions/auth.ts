'use server'

import { cookies } from 'next/headers'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { db } from '@/db/db'

export async function login(
  username: string,
  password: string
): Promise<boolean> {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.name, username))
      .limit(1)
      .execute()

    if (user.length === 0 || user[0].password !== password) {
      return false
    }

    // Set session cookie
    cookies().set('userId', user[0].id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    return true
  } catch (error) {
    console.error('Login error:', error)
    return false
  }
}
