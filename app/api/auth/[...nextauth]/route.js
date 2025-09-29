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
  // ปิดการใช้ adapter เพื่อหลีกเลี่ยงปัญหา ID type conversion
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // สำหรับ OAuth providers (Google) ให้เตรียมข้อมูล role ตั้งแต่ขั้นตอน signIn
      if (account?.provider === 'google' && user?.email) {
        try {
          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name,
              image: user.image,
            },
            create: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: 'member', // default role สำหรับ user ใหม่
            },
            select: { id: true, role: true },
          })
          // เพิ่ม role เข้าไปใน user object ให้ JWT callback ใช้
          user.role = dbUser.role
          user.id = String(dbUser.id) // แปลงเป็น string เพื่อให้เข้ากับ NextAuth
        } catch (e) {
          console.warn('SignIn callback user upsert failed', e)
          user.role = 'member' // fallback
        }
      }
      return true
    },
    jwt: async ({ token, user, account }) => {
      // When user logs in (first time in a session lifecycle)
      if (user) {
        token.id = user.id
        token.email = user.email
        token.image = user.image
        token.role = user.role || 'member'
      }

      // ถ้ายังไม่มี role ให้ลองค้นหาอีกครั้ง (สำหรับ session ต่อไป)
      if (!token.role && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true, role: true },
          })
          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role
          }
        } catch (e) {
          console.warn('JWT callback role lookup failed', e)
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
        session.user.image = token.image
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