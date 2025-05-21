'use client';
import { useAuth } from '@/components/AuthProvider';
import { redirect } from 'next/navigation';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) redirect('/login');
  return <>{children}</>;
}