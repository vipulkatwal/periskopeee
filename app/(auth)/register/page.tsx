'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { FiRefreshCw } from 'react-icons/fi';

/**
 * Registration page for new users.
 * Uses Supabase Auth to sign up with email and password.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function generateRandomIndianPhone() {
    // Indian numbers start with 6-9 and are 10 digits
    const firstDigit = Math.floor(Math.random() * 4) + 6; // 6,7,8,9
    let number = firstDigit.toString();
    for (let i = 0; i < 9; i++) {
      number += Math.floor(Math.random() * 10).toString();
    }
    setPhone('+91 ' + number);
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Supabase Auth sign up
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    // Insert into profiles table if not exists
    const user = data.user;
    if (user) {
      const { data: existingProfile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
      if (!existingProfile) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: user.id,
          name: username,
          phone: phone,
          created_at: new Date().toISOString(),
        });
        if (profileError) {
          setError(profileError.message);
          setLoading(false);
          return;
        }
      }
      // Log the user in automatically
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (loginError) {
        setError(loginError.message);
        return;
      }
      router.push('/chat');
      return;
    }
    setLoading(false);
    setError('User creation failed.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f7f8fa] to-[#e6f2ed] px-2">
      <form
        onSubmit={handleRegister}
        className="relative bg-white p-6 sm:p-7 rounded-2xl shadow-xl w-full max-w-sm flex flex-col items-center border border-green-100"
      >
        {/* Close button inside card, top-right */}
        <button
          type="button"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow text-lg text-gray-400 hover:text-green-700 hover:shadow-lg transition border border-gray-100"
          aria-label="Close"
          tabIndex={-1}
        >
          &times;
        </button>
        {/* Logo */}
        <img src="/peris.png" alt="Periskope Logo" className="w-14 h-14 mb-2 rounded-full shadow-lg border-2 border-green-600 bg-white" />
        <div className="w-full flex justify-center mb-3">
          <div className="w-12 border-t-2 border-green-100"></div>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold font-sans mb-1 text-green-700 text-center tracking-tight">Create an Account</h1>
        <p className="text-gray-500 mb-4 text-center text-base font-sans">Join Periskope and start chatting</p>
        <div className="w-full mb-3">
          <label className="block text-gray-700 text-sm mb-1 font-semibold">Username</label>
          <input
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 bg-[#f7f8fa] transition text-base"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="w-full mb-3">
          <label className="block text-gray-700 text-sm mb-1 font-semibold">Email address</label>
          <input
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 bg-[#f7f8fa] transition text-base"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="w-full mb-3">
          <label className="block text-gray-700 text-sm mb-1 font-semibold">Mobile Number</label>
          <div className="flex gap-2 items-center">
            <input
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 bg-[#f7f8fa] transition text-base"
              type="text"
              placeholder="Mobile Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 border border-green-200 hover:bg-green-200 text-green-700 hover:text-green-900 transition shadow-sm"
              onClick={generateRandomIndianPhone}
              tabIndex={-1}
              title="Generate random number"
            >
              <FiRefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="w-full mb-4">
          <label className="block text-gray-700 text-sm mb-1 font-semibold">Password</label>
          <input
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 bg-[#f7f8fa] transition text-base"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <div className="text-xs text-gray-400 mt-1">Password must be at least 6 characters long</div>
        </div>
        {error && <div className="text-red-500 text-sm mb-2 w-full text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-xl transition text-lg shadow-lg mb-2 mt-2 focus:outline-none focus:ring-2 focus:ring-green-300"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
        <div className="w-full text-center text-gray-500 text-sm mt-3">
          Already have an account?&nbsp;
          <a href="/login" className="text-green-600 hover:underline font-semibold">Sign in</a>
        </div>
      </form>
    </div>
  );
}