import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('admin_session')?.value;
    const host = request.headers.get('host');
    console.log(`Middleware check: ${host} | ${pathname} - Token: ${token ? 'YES' : 'NO'}`);

    // Protect /admin and /api routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/')) {
        // Exclude /api/login and /api/logout from protection
        if (pathname === '/api/login' || pathname === '/api/logout') {
            return NextResponse.next();
        }

        if (!token) {
            console.log(`Unauthorized access to ${pathname} from ${host}`);

            // If it's an API route, return 401 instead of redirecting (avoids CORS issues on redirects)
            if (pathname.startsWith('/api/')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            // For pages, redirect to login
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }

        // Redirect /admin to /admin/events (only applies if token exists and it's an /admin path)
        if (pathname === '/admin') {
            return NextResponse.redirect(new URL('/admin/events', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/admin'],
};
