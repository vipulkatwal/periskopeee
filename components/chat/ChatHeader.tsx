import { useEffect, useState } from 'react';
import { supabase } from '@/components/utils/supabase-server';
import { FiUsers, FiTag, FiMoreVertical } from 'react-icons/fi';
import Avatar from '../ui/Avatar';

/**
 * Props for ChatHeader: receives the chatId to fetch chat info.
 */
interface ChatHeaderProps {
  chatId: string;
}

/**
 * ChatHeader displays the chat title, members, and action icons.
 * Matches the top bar of the chat window in the screenshot.
 */
export default function ChatHeader({ chatId }: ChatHeaderProps) {
  const [chat, setChat] = useState<{ title: string } | null>(null);

  useEffect(() => {
    // Fetch chat info from Supabase
    async function fetchChat() {
      const { data } = await supabase
        .from('chats')
        .select('title')
        .eq('id', chatId)
        .single();
      setChat(data);
    }
    fetchChat();
  }, [chatId]);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
      {/* Left: Chat title and members */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-lg">{chat?.title || '...'}</span>
        {/* Example: member avatars (replace with real data) */}
        <div className="flex -space-x-2">
          <Avatar size={28} />
          <Avatar size={28} />
          <Avatar size={28} />
        </div>
      </div>
      {/* Right: Action icons */}
      <div className="flex items-center gap-4">
        <FiTag className="text-gray-400 cursor-pointer" size={20} title="Labels" />
        <FiUsers className="text-gray-400 cursor-pointer" size={20} title="Members" />
        <FiMoreVertical className="text-gray-400 cursor-pointer" size={20} title="More" />
      </div>
    </div>
  );
}