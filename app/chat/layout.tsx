import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Sidebar from '@/components/sidebar/Sidebar';
import { redirect } from 'next/navigation';

/**
 * Layout for all /chat routes.
 * Renders the sidebar and the main chat area.
 */

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) redirect('/(auth)/login');
  return <>{children}</>;
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-screen w-screen bg-[#f7f8fa]">
        {/* Sidebar on the left */}
        <Sidebar />
        {/* Main chat area */}
        <main className="flex-1 flex flex-col">
          <AuthGate>{children}</AuthGate>
        </main>
      </div>
    </AuthProvider>
  );
}