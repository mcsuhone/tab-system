import { jwtVerify, SignJWT } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface JWTPayload {
  username: string
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return { username: payload.username as string }
  } catch (error) {
    return null
  }
}
