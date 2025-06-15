import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // ยกเว้น API route ไม่ต้องเช็ค session
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  try {
    // สร้าง response object
    const res = NextResponse.next()
    
    // สร้าง Supabase client
    const supabase = createMiddlewareClient({ req: request, res })
    
    // ตรวจสอบ session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // ถ้าไม่มี session และไม่ได้อยู่ที่หน้า login หรือ signup
    if (!session && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/signup')) {
      const redirectUrl = new URL('/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // ถ้ามี session และอยู่ที่หน้า root path (/)
    if (session && request.nextUrl.pathname === '/') {
      const redirectUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // ถ้ามี session และอยู่ที่หน้า login หรือ signup
    if (session && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup'))) {
      const redirectUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // ถ้ามี session และพยายามเข้าถึงหน้า dashboard
    if (session && request.nextUrl.pathname.startsWith('/dashboard')) {
      // เพิ่ม cookie headers
      res.headers.set('Set-Cookie', `sb-auth-token=${session.access_token}; Path=/; HttpOnly; SameSite=Lax`)
      return res
    }

    // กรณีอื่นๆ ให้ผ่านไปได้
    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // ถ้าเกิด error ให้ redirect ไปที่หน้า login
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }
}

// กำหนด path ที่ middleware จะทำงาน
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}