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
    connect-src 'self' http://localhost:3000 http://127.0.0.1:3000 https://api.dellicstravels.com https://*.supabase.co wss://*.supabase.co https://*.vercel.app https://vercel.live wss://ws-us3.pusher.com;
    frame-src 'self' https://vercel.live;
  `.replace(/\s{2,}/g, ' ').trim();
 
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', cspHeader)
  
  const { pathname } = request.nextUrl;
  
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname === '/login' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/favicon.ico' ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg')
  ) {
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set('Content-Security-Policy', cspHeader);
    return response;
  }

  const authCookie = request.cookies.get('dellics_admin_auth');
  
  if (!authCookie || !authCookie.value) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
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
