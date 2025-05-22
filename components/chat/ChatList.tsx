'use client';
import { useRouter } from 'next/navigation';
import { FiVolume2, FiStar } from 'react-icons/fi';
import Avatar from '../ui/Avatar';

const mockChats = [
  {
    id: '1',
    name: 'Test Skope Final 5',
    avatar: undefined,
    lastMessage: "Support2: This doesn't go on Tuesday...",
    phone: '+91 99718 44008',
    labels: ['Demo'],
    unread: 4,
    muted: false,
    pinned: true,
    time: 'Yesterday',
    active: false,
  },
  {
    id: '2',
    name: 'Periskope Team Chat',
    avatar: undefined,
    lastMessage: 'Periskope: Test message',
    phone: '+91 99718 44008',
    labels: ['Demo', 'internal'],
    unread: 1,
    muted: false,
    pinned: false,
    time: '28-Feb-25',
    active: true,
  },
  {
    id: '3',
    name: '+91 99999 99999',
    avatar: undefined,
    lastMessage: "Hi there, I'm Swapnika, Co-Founder of ...",
    phone: '+91 92896 65999',
    labels: ['Demo', 'Signup'],
    unread: 0,
    muted: false,
    pinned: false,
    time: '25-Feb-25',
    active: false,
  },
  // ...add more mock chats as needed
];

const labelColors: Record<string, string> = {
  Demo: 'bg-yellow-100 text-yellow-800',
  Signup: 'bg-green-100 text-green-800',
  internal: 'bg-blue-100 text-blue-800',
  Content: 'bg-green-100 text-green-800',
  'Dont Send': 'bg-red-100 text-red-800',
};

/**
 * ChatList fetches and displays the user's chats.
 * Clicking a chat navigates to its conversation page.
 */
export default function ChatList() {
  const router = useRouter();

  return (
    <ul className="divide-y divide-gray-100">
      {mockChats.map(chat => (
        <li
          key={chat.id}
          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition bg-white hover:bg-green-50 relative ${chat.active ? 'bg-green-50' : ''}`}
          onClick={() => router.push(`/chat/${chat.id}`)}
        >
          <Avatar src={chat.avatar} size={44} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 truncate max-w-[140px]">{chat.name}</span>
              {chat.labels.map(label => (
                <span key={label} className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${labelColors[label] || 'bg-gray-100 text-gray-600'}`}>{label}</span>
              ))}
              {chat.pinned && <FiStar className="text-yellow-400 ml-1" size={16} title="Pinned" />}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 truncate">
              <span className="truncate max-w-[120px]">{chat.lastMessage}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              <span>{chat.phone}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 min-w-[48px]">
            <span className="text-xs text-gray-400 font-medium">{chat.time}</span>
            <div className="flex items-center gap-1">
              {chat.muted && <FiVolume2 className="text-gray-400" size={16} title="Muted" />}
              {chat.unread > 0 && (
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{chat.unread}</span>
              )}
            </div>
          </div>
          {chat.active && <div className="absolute left-0 top-0 h-full w-1 bg-green-600 rounded-r" />}
        </li>
      ))}
    </ul>
  );
}