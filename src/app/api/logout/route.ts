import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const response = NextResponse.redirect(new URL('/login', request.url));

    // Clear the cookie by setting it with Max-Age=0
    response.cookies.set('admin_token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    });

    return response;
}
