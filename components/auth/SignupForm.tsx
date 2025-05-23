"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/components/utils/supabase-client";
import { PeriskopeIcon } from "@/components/ui/Icons";
import {
  validatePhone,
  validateEmail,
  validateUsername,
  validatePassword,
  generateRandomPhone,
} from "@/components/utils/validationUtils";

export const SignupForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserSupabaseClient();

  const generateUIAvatarUrl = (username: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!validateUsername(username)) {
      setError("Username must be between 3 and 30 characters");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!validatePhone(phone)) {
      setError("Please enter a valid phone number (10-15 digits)");
      setLoading(false);
      return;
    }

    try {
      const { data: existingUsers, error: phoneCheckError } = await supabase
        .from("profiles")
        .select("id")
        .eq("phone", phone);

      if (phoneCheckError) {
        console.error("Error checking phone uniqueness:", phoneCheckError);
      } else if (existingUsers && existingUsers.length > 0) {
        setError("This phone number is already in use. Please use a different one.");
        setLoading(false);
        return;
      }

      const finalAvatarUrl = generateUIAvatarUrl(username);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            avatar_url: finalAvatarUrl,
            phone,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        if (authData.session) {
          setSuccess("Account created successfully! Redirecting...");
          await new Promise((r) => setTimeout(r, 2000));
          router.push("/");
        } else {
          setSuccess("Account created! Please check your email to confirm.");
          await new Promise((r) => setTimeout(r, 3000));
          router.push("/auth/signin");
        }
      }
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        setError((error as { message?: string }).message || "Error signing up");
      } else {
        setError("Error signing up");
      }
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 sm:p-8 bg-white rounded-2xl shadow-lg">
      <div className="text-center">
        <PeriskopeIcon className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold text-green-700">Create an Account</h1>
        <p className="mt-1 text-sm text-gray-600">Join Periskope and start chatting</p>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
      {success && <div className="p-3 bg-green-50 text-green-600 rounded-md text-sm">{success}</div>}

      <form className="space-y-4" onSubmit={handleSignUp}>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none transition"
            autoComplete="username"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none transition"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+1 123-456-7890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none transition"
            autoComplete="tel"
          />
          <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
            <span>Format: +1 123-456-7890</span>
            <button
              type="button"
              onClick={() => setPhone(generateRandomPhone())}
              className="text-green-600 hover:text-green-500 transition"
            >
              Generate Random
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none transition"
            autoComplete="new-password"
          />
          <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white font-medium text-sm py-2 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-green-600 hover:text-green-500 font-medium transition">
          Sign in
        </Link>
      </div>
    </div>
  );
};
