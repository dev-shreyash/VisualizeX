import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect logged-in users from sign-in/sign-up to dashboard
  if (token && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users trying to access the dashboard
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Restrict access to admin routes
  if (url.pathname.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN') {
      //console.log(token)

      return NextResponse.redirect(new URL('/403', request.url)); // Redirect to a 403 Forbidden page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/sign-in', '/sign-up', '/dashboard/:path*', '/admin/:path*'], // Match both dashboard and admin routes
};
