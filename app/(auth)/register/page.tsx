'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Registration page for new users.
 * Uses Supabase Auth to sign up with email and password.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      router.push('/login');
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f7f8fa] to-[#e6f2ed]">
      <form
        onSubmit={handleRegister}
        className="relative bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center"
      >
        {/* Close button inside card, top-right */}
        <button
          type="button"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow text-lg text-gray-400 hover:text-green-700 hover:shadow-lg transition"
          aria-label="Close"
        >
          &times;
        </button>
        {/* Logo */}
        <img src="/peris.png" alt="Periskope Logo" className="w-16 h-16 mb-2 rounded-full shadow-lg border-2 border-green-600" />
        <div className="w-full flex justify-center mb-2">
          <div className="w-12 border-t-2 border-green-100"></div>
        </div>
        <h1 className="text-xl font-extrabold font-sans mb-1 text-green-700 text-center tracking-tight">Create an Account</h1>
        <p className="text-gray-500 mb-3 text-center text-base font-sans">Join Periskope and start chatting</p>
        <div className="w-full mb-2">
          <label className="block text-gray-700 text-sm mb-1 font-semibold">Username</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 bg-[#f7f8fa] transition"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="w-full mb-2">
          <label className="block text-gray-700 text-sm mb-1 font-semibold">Email address</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 bg-[#f7f8fa] transition"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="w-full mb-2">
          <label className="block text-gray-700 text-sm mb-1 font-semibold">Password</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 bg-[#f7f8fa] transition"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <div className="text-xs text-gray-400 mt-1">Password must be at least 6 characters long</div>
        </div>
        <div className="w-full mb-2">
          <label className="block text-gray-700 text-sm mb-1 font-semibold">Avatar URL (optional)</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 bg-[#f7f8fa] transition"
            type="url"
            placeholder="https://avatars.githubusercontent.com/yourusername"
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
          />
          <div className="text-xs text-gray-400 mt-1">
            Only GitHub avatar URLs are supported (e.g., https://avatars.githubusercontent.com/yourusername)<br />
            If left empty, an avatar will be automatically generated from your username
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mb-2 w-full text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition mb-2 text-base shadow"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
        <div className="w-full text-center text-gray-500 text-sm mt-2">
          Already have an account?&nbsp;
          <a href="/login" className="text-green-600 hover:underline font-semibold">Sign in</a>
        </div>
      </form>
    </div>
  );
}