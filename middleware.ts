import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')
  const role = request.cookies.get('userRole')?.value // ← Ambil role dari cookie
  const path = request.nextUrl.pathname
  
  const isAuthenticated = !!token
  const isAdminPage = path.startsWith('/admin')
  const isCustomerPage = path.startsWith('/costumer')
  const isAuthPage = path.startsWith('/sign-in') || path.startsWith('/sign-up')
  
  // 1️⃣ Belum login & akses protected page
  if (!isAuthenticated && (isAdminPage || isCustomerPage)) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  // 2️⃣ Sudah login & akses halaman auth
  if (isAuthenticated && isAuthPage) {
    // Redirect sesuai role
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dasboard', request.url))
    } else if (role === 'CUSTOMER') {
      return NextResponse.redirect(new URL('/costumer/dasboard', request.url))
    }
  }
  
  // 3️⃣ ROLE-BASED ACCESS: Admin akses customer page (FORBIDDEN)
  if (isAuthenticated && isCustomerPage && role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin/dasboard', request.url))
  }
  
  // 4️⃣ ROLE-BASED ACCESS: Customer akses admin page (FORBIDDEN)
  if (isAuthenticated && isAdminPage && role === 'CUSTOMER') {
    return NextResponse.redirect(new URL('/costumer/dasboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/costumer/:path*',
    '/sign-in',
    '/sign-up'
  ]
}