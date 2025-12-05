import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_NAME = 'xinchao_auth_token';

async function verifyJWT(token) {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not configured!');
    return null;
  }
  
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }
  
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(TOKEN_NAME)?.value;
    
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    const payload = await verifyJWT(token);
    
    if (!payload) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.set(TOKEN_NAME, '', { maxAge: 0, path: '/' });
      return response;
    }
    
    if (pathname === '/admin/users' && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
