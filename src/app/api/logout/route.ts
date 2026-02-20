import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'https://savannahunited-berlin-ev.com'));

    response.cookies.set('savannah_admin_session', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: new Date(0),
        path: '/',
    });

    return response;
}
