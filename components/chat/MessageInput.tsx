import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '../utils/AuthProvider';
import { FiSend } from 'react-icons/fi';

/**
 * Props for MessageInput: receives the chatId to send messages to.
 */
interface MessageInputProps {
  chatId: string;
}

/**
 * MessageInput provides a text box and send button for sending messages.
 * Saves the message to Supabase and clears the input.
 */
export default function MessageInput({ chatId }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Handle sending a message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;
    setLoading(true);

    // Insert the new message into Supabase
    await supabase.from('messages').insert({
      chat_id: chatId,
      sender_id: user.id,
      content,
      created_at: new Date().toISOString(),
    });

    setContent('');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSend} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Type a message"
        value={content}
        onChange={e => setContent(e.target.value)}
        className="flex-1 px-4 py-2 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-200"
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2 transition disabled:opacity-50"
        disabled={loading || !content.trim()}
        title="Send"
      >
        <FiSend size={20} />
      </button>
    </form>
  );
}