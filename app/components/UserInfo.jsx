"use client";
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function UserInfo() {
  const { data: session, status, update } = useSession();

  // Force refresh session เมื่อ component mount และเมื่อ role ยังไม่มี
  useEffect(() => {
    if (session?.user && !session.user.role) {
      update();
    }
  }, [session, update]);

  if (status === 'loading') {
    return <p className="text-sm text-gray-400">Loading session...</p>;
  }

  if (status === 'unauthenticated' || !session?.user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">Not signed in</span>
        <button onClick={() => signIn()} className="px-2 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-500">Sign in</button>
      </div>
    );
  }

  const { user } = session;
  return (
    <div className="flex items-center gap-3">
      {user.image && (
        <img src={user.image} alt={user.name || 'avatar'} className="w-8 h-8 rounded-full" />
      )}
      <div className="text-sm leading-tight">
        <div className="font-medium">{user.name || user.email}</div>
        <div className="text-xs text-gray-400">Role: {user.role || 'member'}</div>
      </div>
      <button onClick={() => signOut()} className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600">Sign out</button>
    </div>
  );
}
