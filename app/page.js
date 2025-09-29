"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert } from './ui/alert';

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const params = useSearchParams();

  const oauthError = params.get('error');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const result = await signIn('credentials', { redirect: false, email, password });
      if (result?.error) {
        setErrorMsg(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error);
      } else {
        router.push('/profile');
      }
    } catch (err) {
      setErrorMsg('Unexpected error.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardTitle>Sign in to your account</CardTitle>
        <form onSubmit={handleSubmit} className="space-y-5">
          {oauthError && (
            <Alert type="error" title="OAuth Error">
              {oauthError === 'OAuthCallback' ? 'Google sign-in failed. Check configuration.' : oauthError}
            </Alert>
          )}
          {errorMsg && <Alert type="error">{errorMsg}</Alert>}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <div className="flex flex-col gap-3">
            <Button type="submit" loading={loading} disabled={loading} className="w-full">Sign In</Button>
            <Button type="button" variant="outline" onClick={() => signIn('google')} className="w-full flex gap-2">
              <span className="text-red-500" aria-hidden>🟢</span>
              <span>Sign in with Google</span>
            </Button>
          </div>
        </form>
        <CardFooter>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By continuing you agree to our <a href="#" className="underline">Terms</a> & <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}