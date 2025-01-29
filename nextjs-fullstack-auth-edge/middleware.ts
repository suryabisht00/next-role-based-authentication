import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    // Protect admin routes
    if (pathname.startsWith('/admin')) {
        if (!isLoggedIn || req.auth?.user?.role !== 'admin') {
            return NextResponse.redirect(new URL('/signin', req.url));
        }
    }

    // Protect profile routes
    if (pathname.startsWith('/profile') && !isLoggedIn) {
        return NextResponse.redirect(new URL('/signin', req.url));
    }

    // Redirect authenticated users away from auth pages
    if (isLoggedIn && (pathname === '/signin' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/admin/:path*', '/profile/:path*', '/signin', '/signup']
};