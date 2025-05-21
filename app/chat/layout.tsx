import Sidebar from '@/components/sidebar/Sidebar';
import AuthGate from '@/components/utils/AuthGate';
import ChatList from '@/components/chat/ChatList';
import LabelList from '@/components/sidebar/LabelList';
import MemberAssign from '@/components/sidebar/MemberAssign';
import ChatFilter from '@/components/sidebar/ChatFilter';

/**
 * Layout for all /chat routes.
 * Renders the sidebar and the main chat area.
 */

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen bg-[#f7f8fa]">
      {/* Sidebar on the left */}
      <Sidebar />
      {/* Chat list panel always visible */}
      <aside className="flex flex-col h-full w-[340px] bg-white rounded-tr-2xl shadow-lg border-l border-gray-200 overflow-hidden">
        {/* Top: Custom filter and search */}
        <div className="px-4 pt-4 pb-2 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-green-700 text-lg">Custom filter</span>
          </div>
          <ChatFilter />
        </div>
        {/* Chat list */}
        <div className="flex-1 overflow-y-auto bg-[#f7f8fa]">
          <ChatList />
        </div>
        {/* Bottom: Labels and member assign */}
        <div className="p-4 border-t border-gray-100 bg-[#f7f8fa]">
          <LabelList />
          <MemberAssign />
        </div>
      </aside>
      {/* Main chat area */}
      <main className="flex-1 flex flex-col">
        <AuthGate>{children}</AuthGate>
      </main>
    </div>
  );
}