import Sidebar from '@/components/sidebar/Sidebar';
import AuthGate from '@/components/AuthGate';

/**
 * Layout for all /chat routes.
 * Renders the sidebar and the main chat area.
 */

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen bg-[#f7f8fa]">
      {/* Sidebar on the left */}
      <Sidebar />
      {/* Main chat area */}
      <main className="flex-1 flex flex-col">
        <AuthGate>{children}</AuthGate>
      </main>
    </div>
  );
}