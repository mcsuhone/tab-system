import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/utils/jwt'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isLoginPage = request.nextUrl.pathname === '/login'

  // Verify JWT token
  const isValidToken = token && verifyJWT(token)
  return NextResponse.next()

  // If user is not logged in and trying to access protected route
  if (!isValidToken && !isLoginPage) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If user is logged in and trying to access login page
  if (isValidToken && isLoginPage) {
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
