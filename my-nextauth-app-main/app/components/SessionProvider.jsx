'use client'
// Centralized SessionProvider wrapper.
// Accepts optional `session` (from getServerSession) to avoid an extra client fetch.
// Add a simple loading boundary example for future extension.
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

export default function SessionProvider({ children, session }) {
	return (
		<NextAuthSessionProvider session={session}>
			{children}
		</NextAuthSessionProvider>
	)
}