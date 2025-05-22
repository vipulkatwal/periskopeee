'use client';

import { SignupForm } from "@/components/auth/SignupForm";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <SignupForm />
    </div>
  );
}
