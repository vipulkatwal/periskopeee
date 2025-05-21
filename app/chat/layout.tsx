import Sidebar from '@/components/sidebar/Sidebar';

/**
 * Layout for all /chat routes.
 * Renders the sidebar and the main chat area.
 */
export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar on the left */}
      <Sidebar />
      {/* Main chat area */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}