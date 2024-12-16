import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isRootPage = request.nextUrl.pathname === '/'

  // Verify JWT token
  const isValidToken = token && (await verifyJWT(token))

  // If user is not logged in and trying to access protected route (including root)
  if (!isValidToken && (!isLoginPage || isRootPage)) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If user is logged in and trying to access login page
  if (isValidToken && isLoginPage) {
    const tabUrl = new URL('/tab', request.url)
    return NextResponse.redirect(tabUrl)
  }

  // If user is logged in and on root page, redirect to /tab
  if (isValidToken && isRootPage) {
    const tabUrl = new URL('/tab', request.url)
    return NextResponse.redirect(tabUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    '/tab/:path*' // Explicitly include the tab route
  ]
}
