import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'seapedia-secret-key-change-in-production'
);

// Routes yang membutuhkan autentikasi
const protectedPaths = ['/dashboard', '/pilih-peran'];

// Routes yang hanya bisa diakses guest (sudah login → redirect)
const guestOnlyPaths = ['/masuk', '/daftar'];

// Role-specific dashboard paths
const roleDashboardMap: Record<string, string> = {
  BUYER: '/dashboard/buyer',
  SELLER: '/dashboard/seller',
  DRIVER: '/dashboard/driver',
  ADMIN: '/dashboard/admin',
};

interface UserPayload {
  userId: string;
  roles: string[];
  activeRole: string | null;
}

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5;

  const record = rateLimitMap.get(ip);
  if (!record || now - record.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  rateLimitMap.set(ip, record);
  return true;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/register')) {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: 'Terlalu banyak percobaan. Silakan coba lagi nanti.' }, { status: 429 });
    }
  }

  const token = request.cookies.get('token')?.value;

  let user: UserPayload | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = payload as unknown as UserPayload;
    } catch {
      // Token invalid — treat as guest
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }

  // Protected routes — require auth
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/masuk', request.url));
  }

  // Guest-only routes — redirect if logged in
  const isGuestOnly = guestOnlyPaths.some((p) => pathname.startsWith(p));
  if (isGuestOnly && user) {
    if (user.activeRole) {
      const dashPath = roleDashboardMap[user.activeRole] || '/';
      return NextResponse.redirect(new URL(dashPath, request.url));
    }
    return NextResponse.redirect(new URL('/pilih-peran', request.url));
  }

  // Dashboard access — require active role and correct role path
  if (pathname.startsWith('/dashboard') && user) {
    if (!user.activeRole) {
      return NextResponse.redirect(new URL('/pilih-peran', request.url));
    }

    // Check role-specific access
    for (const [role, path] of Object.entries(roleDashboardMap)) {
      if (pathname.startsWith(path) && user.activeRole !== role) {
        const correctPath = roleDashboardMap[user.activeRole] || '/';
        return NextResponse.redirect(new URL(correctPath, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/pilih-peran',
    '/masuk',
    '/daftar',
    '/api/auth/login',
    '/api/auth/register',
  ],
};
