import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const allCookies = request.cookies.getAll();
    const token = request.cookies.get('savannah_session')?.value;
    const rawCookieHeader = request.headers.get('cookie');

    console.log(`Middleware auth check for ${pathname}. Total cookies: ${allCookies.length}. Token present: ${!!token}`);
    console.log(`Raw Cookie Header: ${rawCookieHeader || 'None'}`);

    if (allCookies.length > 0) {
        console.log('Cookie names:', allCookies.map(c => c.name).join(', '));
    }

    // Protect /admin routes
    if (pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Redirect /admin to /admin/events
        if (pathname === '/admin') {
            return NextResponse.redirect(new URL('/admin/events', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/admin'],
};
