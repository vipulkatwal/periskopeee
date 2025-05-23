import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect /auth/signup to /auth/register
  if (req.nextUrl.pathname === '/auth/signup') {
    return NextResponse.redirect(new URL('/auth/register', req.url));
  }

  // Auth condition
  const isAuth = !!session;
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth/login') ||
                    req.nextUrl.pathname.startsWith('/auth/signup') ||
                    req.nextUrl.pathname.startsWith('/auth/register');

  if (isAuthPage) {
    if (isAuth) {
      // If user is signed in and tries to access auth pages, redirect to chats
      return NextResponse.redirect(new URL('/chats', req.url));
    }
    // Allow access to auth pages if not authenticated
    return res;
  }

  if (!isAuth) {
    // If user is not signed in and tries to access protected pages, redirect to login
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};