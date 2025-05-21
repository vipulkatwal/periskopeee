import ChatFilter from './ChatFilter';
import ChatList from '../chat/ChatList';
import LabelList from './LabelList';
import MemberAssign from './MemberAssign';

/**
 * Sidebar component for chat navigation, search, labels, and members.
 * Matches the left panel in the screenshot.
 */
export default function Sidebar() {
  return (
    <aside className="w-[340px] bg-white border-r flex flex-col h-full">
      {/* Top: Custom filter and search */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-green-700">Custom filter</span>
          {/* Add filter icon here if needed */}
        </div>
        <ChatFilter />
      </div>
      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        <ChatList />
      </div>
      {/* Bottom: Labels and member assign */}
      <div className="p-4 border-t">
        <LabelList />
        <MemberAssign />
      </div>
    </aside>
  );
}