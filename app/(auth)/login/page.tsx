'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push('/chat');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f7f8fa] to-[#e6f2ed]">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center"
      >
        {/* Logo at the top */}
        <img src="/peris.png" alt="Periskope Logo" className="w-20 h-20 mb-4 rounded-full shadow-lg border-2 border-green-600" />
        <div className="w-full flex justify-center mb-4">
          <div className="w-16 border-t-2 border-green-100"></div>
        </div>
        <h1 className="text-3xl font-extrabold font-sans mb-2 text-green-700 text-center tracking-tight">Welcome Back</h1>
        <p className="text-gray-500 mb-8 text-center text-lg font-sans">Sign in to your Periskope account</p>
        <div className="w-full mb-5">
          <label className="block text-gray-700 text-sm mb-1 font-semibold">Email address</label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 bg-[#f7f8fa] transition"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="w-full mb-2">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-gray-700 text-sm font-semibold">Password</label>
            <a href="#" className="text-green-600 text-xs hover:underline">Forgot password?</a>
          </div>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 bg-[#f7f8fa] transition"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="w-full flex items-center mb-5">
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="remember" className="text-gray-700 text-sm">Remember me</label>
        </div>
        {error && <div className="text-red-500 text-sm mb-2 w-full text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition mb-2 text-lg shadow"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="w-full text-center text-gray-500 text-sm mt-2">
          Already have an account?&nbsp;
          <Link href="/register" className="text-green-600 hover:underline font-semibold">Sign up</Link>
        </div>
      </form>
    </div>
  );
}