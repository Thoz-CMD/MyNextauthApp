"use client";
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from './button';

export function Navbar() {
  const { data: session, status } = useSession();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 backdrop-blur bg-white/70 dark:bg-gray-950/70">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-gray-900 dark:text-gray-100">MyAuth</Link>
        <nav className="flex items-center gap-4">
          <Link href="/profile" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Profile</Link>
          {status === 'authenticated' ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">{session.user?.email}</span>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>Sign out</Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => signIn()}>Sign in</Button>
          )}
        </nav>
      </div>
    </header>
  );
}
