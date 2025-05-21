import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ChatBubble from '../ui/ChatBubble';
import { useAuth } from '../AuthProvider';

/**
 * Props for MessageList: receives the chatId to fetch messages.
 */
interface MessageListProps {
  chatId: string;
}

/**
 * MessageList fetches and displays all messages for a chat.
 * Scrolls to the bottom when new messages arrive.
 */
export default function MessageList({ chatId }: MessageListProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch messages for this chat
    async function fetchMessages() {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
      if (!error && data) setMessages(data);
      setLoading(false);
    }
    fetchMessages();

    // Subscribe to new messages in real-time
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        payload => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return <div className="p-4 text-gray-400">Loading messages...</div>;
  }

  if (messages.length === 0) {
    return <div className="p-4 text-gray-400">No messages yet.</div>;
  }

  return (
    <div className="flex flex-col gap-2 px-6 py-4">
      {messages.map(msg => (
        <ChatBubble
          key={msg.id}
          content={msg.content}
          isSender={msg.sender_id === user?.id}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}