import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' ${isDev ? "'unsafe-eval'" : ""} 'unsafe-inline' https://vercel.live https://*.vercel.live;
    style-src 'self' 'unsafe-inline';
    img-src * blob: data:;
    font-src 'self' data:;
    connect-src 'self' http://localhost:* https://*.supabase.co wss://*.supabase.co https://*.vercel.app https://api.dellicstravels.com https://vercel.live wss://ws-us3.pusher.com;
    frame-src 'self' https://vercel.live;
  `.replace(/\s{2,}/g, ' ').trim();
 
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', cspHeader)

  const { pathname } = request.nextUrl;
  
  const protectedRoutes = ['/profile', '/bookings', '/settings', '/saved'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    const authCookie = request.cookies.get('dellics_auth_session');
    const supabaseCookie = request.cookies.getAll().some(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
    
    if ((!authCookie || !authCookie.value) && !supabaseCookie) {
      const loginUrl = new URL('/signin', request.url);
      loginUrl.searchParams.set('redirect_to', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', cspHeader);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
