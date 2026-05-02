import { NextResponse } from 'next/server';

function normalizeCredential(value) {
  const trimmed = String(value || '').trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

export async function POST(request) {
  const formData = await request.formData();
  const email = normalizeCredential(formData.get('email'));
  const password = normalizeCredential(formData.get('password'));
  const expectedEmail = normalizeCredential(process.env.LOGIN_EMAIL);
  const expectedPassword = normalizeCredential(process.env.LOGIN_PASSWORD);

  if (!expectedEmail || !expectedPassword) {
    return NextResponse.redirect(new URL('/?error=misconfigured', request.url), 302);
  }

  if (email !== expectedEmail || password !== expectedPassword) {
    return NextResponse.redirect(new URL('/?error=invalid', request.url), 302);
  }

  const response = NextResponse.redirect(new URL('/dashboard', request.url), 302);
  response.cookies.set('parcel_auth', '1', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return response;
}