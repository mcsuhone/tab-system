import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const user = await db
      .select()
      .from(users)
      .where(eq(users.name, username))
      .limit(1)
      .execute()

    if (user.length === 0 || user[0].password !== password) {
      return new NextResponse('Invalid credentials', { status: 401 })
    }

    // Set session cookie
    cookies().set('userId', user[0].id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    return new NextResponse('Login successful', { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
