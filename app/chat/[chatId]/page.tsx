'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import { useParams } from 'next/navigation';

export default function ChatConversationPage() {
  const params = useParams();
  const chatId = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch messages and subscribe to realtime
  useEffect(() => {
    if (!chatId) return;
    async function fetchMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    }
    fetchMessages();

    // Realtime subscription
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user) return;
    await supabase.from('messages').insert({
      chat_id: chatId,
      sender_id: user.id,
      content: input,
      created_at: new Date().toISOString(),
    });
    setInput('');
  }

  return (
    <div className="flex flex-col flex-1 h-full bg-[#f7f8fa]">
      {/* Chat header can go here */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`rounded-lg px-4 py-2 max-w-md shadow text-sm ${msg.sender_id === user?.id ? 'bg-green-100 text-right text-gray-900' : 'bg-white text-left text-gray-800'}`}>
              <div>{msg.content}</div>
              <div className="text-xs text-gray-400 mt-1 text-right">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {/* Message input */}
      <form onSubmit={sendMessage} className="p-4 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Message..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-200 bg-[#f7f8fa] focus:outline-none focus:ring-2 focus:ring-green-200"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2 transition">Send</button>
      </form>
    </div>
  );
}