'use client';
import { FiHome, FiMessageCircle, FiEdit2, FiBarChart2, FiList, FiVolume2, FiZap, FiBook, FiImage, FiCheckSquare, FiSettings, FiStar, FiPlay } from 'react-icons/fi';
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
    <aside className="w-[370px] bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo at the top */}
      <div className="flex justify-center py-6 border-b border-gray-200">
        <img src="/peris.png" alt="Periskope Logo" className="w-12 h-12" />
      </div>
      {/* Sidebar icons */}
      <div className="flex flex-col gap-4 px-2 py-4 border-b border-gray-200">
        <SidebarIcon icon={<FiHome size={22} />} />
        <SidebarIcon icon={<FiMessageCircle size={22} />} />
        <SidebarIcon icon={<FiEdit2 size={22} />} />
        <SidebarIcon icon={<FiBarChart2 size={22} />} />
        <SidebarIcon icon={<FiList size={22} />} />
        <SidebarIcon icon={<FiVolume2 size={22} />} />
        <SidebarIcon icon={<FiZap size={22} />} />
        <SidebarIcon icon={<FiBook size={22} />} />
        <SidebarIcon icon={<FiImage size={22} />} />
        <SidebarIcon icon={<FiCheckSquare size={22} />} />
        <SidebarIcon icon={<FiSettings size={22} />} />
        <SidebarIcon icon={<FiStar size={22} />} />
        <SidebarIcon icon={<FiPlay size={22} />} />
      </div>
      {/* Top: Custom filter and search */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-green-700 text-lg">Custom filter</span>
        </div>
        <ChatFilter />
      </div>
      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        <ChatList />
      </div>
      {/* Bottom: Labels and member assign */}
      <div className="p-4 border-t border-gray-200">
        <LabelList />
        <MemberAssign />
      </div>
    </aside>
  );
}

function SidebarIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-green-50 cursor-pointer text-gray-500 mb-1">
      {icon}
    </div>
  );
}