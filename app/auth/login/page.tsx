'use client';

import { SigninForm } from "@/components/auth/SigninForm";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <SigninForm />
    </div>
  );
}