import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('admin_session')?.value;

    console.log(`Middleware check: ${pathname} - Token: ${token ? 'YES' : 'NO'}`);

    // Protect /admin routes
    if (pathname.startsWith('/admin')) {
        if (!token) {
            console.log('Redirecting to login: No Token Found');
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
