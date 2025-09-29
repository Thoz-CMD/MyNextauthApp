import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from "next-auth/providers/google"
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from '@auth/prisma-adapter'

const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@doe.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        } else {
          throw new Error('Invalid email or password')
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // When user logs in (first time in a session lifecycle)
      if (user) {
        token.id = user.id
        token.email = user.email
        // Credentials provider supplies role directly; Google may not.
        if (user.role) {
          token.role = user.role
        }
      }

      // If role still missing (e.g. Google provider profile() omitted it), try to fetch once.
      if (!token.role && (token.email || token.id)) {
        try {
          const dbUser = await prisma.user.findFirst({
            where: token.id ? { id: Number(token.id) } : { email: token.email },
            select: { id: true, role: true },
          })
          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role
          }
        } catch (e) {
          // Silently ignore to avoid breaking auth flow; optionally log in dev.
          if (process.env.NODE_ENV !== 'production') {
            console.warn('JWT callback role lookup failed', e)
          }
        }
      }
      // Default fallback
      if (!token.role) token.role = 'member'
      return token
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.image = token.picture // เพิ่มการรับรูปภาพเข้ามา
      }
      return session
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/profile`
    },
  },
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }