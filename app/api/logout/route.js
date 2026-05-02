import { NextResponse } from 'next/server';

export async function POST(request) {
  const response = NextResponse.redirect(new URL('/', request.url), 302);

  response.cookies.set('parcel_auth', '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}