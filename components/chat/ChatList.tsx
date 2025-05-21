'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { FiCircle } from 'react-icons/fi';

/**
 * Represents a single chat in the list.
 */
interface Chat {
  id: string;
  title: string;
  // Add more fields as needed (e.g., last message, unread count, labels)
}

/**
 * ChatList fetches and displays the user's chats.
 * Clicking a chat navigates to its conversation page.
 */
export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    async function fetchChats() {
      setLoading(true);
      // Get chats where the user is a member
      const { data, error } = await supabase
        .from('chat_members')
        .select('chat_id, chats (id, title)')
        .eq('user_id', user.id);
      if (!error && data) {
        setChats(data.map((row: any) => row.chats));
      }
      setLoading(false);
    }
    fetchChats();
  }, [user]);

  if (loading) {
    return <div className="p-4 text-gray-400">Loading chats...</div>;
  }

  if (chats.length === 0) {
    return <div className="p-4 text-gray-400">No chats found.</div>;
  }

  return (
    <ul>
      {chats.map(chat => (
        <li
          key={chat.id}
          className="flex items-center px-4 py-3 cursor-pointer hover:bg-green-50 border-b border-gray-100"
          onClick={() => router.push(`/chat/${chat.id}`)}
        >
          {/* Status icon (replace with actual logic) */}
          <FiCircle className="text-green-400 mr-3" size={20} />
          <div className="flex-1">
            <div className="font-medium text-gray-900">{chat.title}</div>
            {/* Add last message, labels, etc. here */}
          </div>
          {/* Example: unread badge */}
          {/* <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">2</span> */}
        </li>
      ))}
    </ul>
  );
}