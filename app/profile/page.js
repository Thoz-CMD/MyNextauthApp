'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardTitle, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { Avatar } from '../ui/avatar'

export default function Profile() {
    const { data: session, status } = useSession()

    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/')
        }
    }, [status, router])

    // When after loading success and have session, show profile
        if (status === 'loading') {
            return <div className="flex h-[50vh] items-center justify-center"><p className="text-sm text-gray-500">Loading profile...</p></div>
        }
        if (status === 'unauthenticated' || !session?.user) return null

        const { user } = session
        const roleColor = user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'

        return (
            <div className="flex items-start justify-center min-h-[60vh]">
                <Card className="w-full max-w-lg">
                    <CardTitle>Your Profile</CardTitle>
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar src={user.image} alt={user.name} size={72} />
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold leading-tight">{user.name || 'Unnamed User'}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                            <span className={`inline-block text-xs px-2 py-1 rounded-md font-medium ${roleColor}`}>{user.role}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <p className="font-medium text-gray-600 dark:text-gray-300">Display Name</p>
                            <p>{user.name || '-'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-gray-600 dark:text-gray-300">Role</p>
                            <p className="capitalize">{user.role}</p>
                        </div>
                    </div>
                    <CardFooter className="flex items-center justify-between">
                        <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>Sign out</Button>
                        <Button variant="secondary" disabled>Settings (soon)</Button>
                    </CardFooter>
                </Card>
            </div>
        )
}