import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname
  const role = (user?.user_metadata?.role ?? 'player_parent') as string

  const isAuth = path.startsWith('/sign-in') || path.startsWith('/sign-up') || path.startsWith('/forgot-password') || path.startsWith('/reset-password')
  const isAdmin = path.startsWith('/admin')
  const isDashboard = path.startsWith('/dashboard')

  // Authenticated users don't need auth pages
  if (user && isAuth) {
    const dest = (role === 'admin' || role === 'worker') ? '/admin' : '/dashboard'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // /admin requires admin or worker
  if (isAdmin) {
    if (!user) return NextResponse.redirect(new URL('/sign-in', request.url))
    if (role !== 'admin' && role !== 'worker')
      return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // /dashboard requires any authenticated user
  if (isDashboard) {
    if (!user) return NextResponse.redirect(new URL('/sign-in', request.url))
    if (role === 'admin' || role === 'worker')
      return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|brand|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
