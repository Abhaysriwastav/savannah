import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin routes (excluding login if it was under admin, but it's /login)
    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('admin_token')?.value;

        // Simplistic check: If no token exists, redirect to login
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Redirect /admin access directly to /admin/events as default dashboard
    if (pathname === '/admin') {
        return NextResponse.redirect(new URL('/admin/events', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/admin'],
};
