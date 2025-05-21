import React from 'react';
import { FiSearch, FiFilter, FiUser, FiTag, FiUsers } from "react-icons/fi";
import type { Chat, Profile } from "../../../types";

interface ChatSidebarProps {
  chats: Chat[];
  selectedChat: Chat | null;
  loading: boolean;
  userProfile: Profile | null;
  onSelectChat: (chat: Chat) => void;
}

export default function ChatSidebar({ chats, selectedChat, loading, userProfile, onSelectChat }: ChatSidebarProps) {
  return (
    <aside className="w-80 bg-white border-r flex flex-col">
      <div className="p-4 flex items-center justify-between border-b">
        <span className="font-bold text-lg">Chats</span>
        <button className="p-2 rounded hover:bg-gray-200">
          <FiUser size={20} />
        </button>
      </div>
      <div className="p-2 flex gap-2">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-2 top-2.5 text-gray-400" />
          <input
            className="w-full pl-8 pr-2 py-2 rounded bg-gray-100"
            placeholder="Search"
          />
        </div>
        <button className="p-2 rounded hover:bg-gray-200">
          <FiFilter size={20} />
        </button>
      </div>
      {/* Labels placeholder */}
      <div className="px-4 py-2 border-b flex items-center gap-2">
        <FiTag className="text-gray-400" />
        <span className="text-gray-600 text-sm">Labels</span>
        <button className="ml-auto text-xs text-green-600 hover:underline">+ Add</button>
      </div>
      {/* Members placeholder */}
      <div className="px-4 py-2 border-b flex items-center gap-2">
        <FiUsers className="text-gray-400" />
        <span className="text-gray-600 text-sm">Assign Members</span>
        <button className="ml-auto text-xs text-green-600 hover:underline">+ Assign</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-gray-400">Loading chats...</div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-gray-400">No chats found</div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${
                selectedChat?.id === chat.id ? "bg-gray-200" : ""
              }`}
              onClick={() => onSelectChat(chat)}
            >
              {chat.name}
            </div>
          ))
        )}
      </div>
      {/* User profile section */}
      <div className="p-4 border-t flex items-center gap-3 bg-gray-50">
        {userProfile?.avatar_url ? (
          <img
            src={userProfile.avatar_url}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl text-white">
            <FiUser />
          </div>
        )}
        <div>
          <div className="font-semibold text-gray-800 text-sm">{userProfile?.name || "User"}</div>
          <div className="text-xs text-gray-500">{userProfile?.id?.slice(0, 8)}</div>
        </div>
      </div>
    </aside>
  );
}