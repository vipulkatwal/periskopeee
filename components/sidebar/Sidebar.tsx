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
    <div className="flex h-full">
      {/* Icon bar */}
      <div className="flex flex-col items-center bg-[#f6f7f9] w-16 py-4 gap-2 border-r border-gray-200">
        <div className="mb-4">
          <img src="/peris.png" alt="Periskope Logo" className="w-10 h-10 rounded-full shadow border-2 border-white bg-white" />
        </div>
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
      {/* Chat list panel */}
      <aside className="flex flex-col h-full w-[340px] bg-white rounded-tr-2xl shadow-lg overflow-hidden">
        {/* Logo at the top, centered */}
        <div className="flex justify-center pt-6 pb-2">
          <img src="/peris.png" alt="Periskope Logo" className="w-12 h-12 rounded-full shadow border-2 border-white bg-white" />
        </div>
        {/* Top: Custom filter and search */}
        <div className="px-4 pt-2 pb-2 border-b border-gray-100">
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
        <div className="p-4 border-t border-gray-100">
          <LabelList />
          <MemberAssign />
        </div>
      </aside>
    </div>
  );
}

function SidebarIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-green-50 cursor-pointer text-gray-500 mb-1">
      {icon}
    </div>
  );
}