import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(request) {
    const user = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })

    // Debug only when needed (uncomment if troubleshooting)
    // if (!user) console.debug('[middleware] anonymous access', request.nextUrl.pathname)

    const { pathname } = request.nextUrl

    if (pathname.startsWith('/protected') && (!user || user.role !== 'admin')) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
}