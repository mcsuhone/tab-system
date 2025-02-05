'use server'

import { verifyJWT } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function rememberUserAction(): Promise<boolean> {
  const token = cookies().get('token')
  if (!token) return false

  const payload = await verifyJWT(token.value)

  if (!payload) return false

  const { rememberMe } = payload

  if (!rememberMe) return false

  return rememberMe as boolean
}
