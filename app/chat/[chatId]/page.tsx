'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/utils/AuthProvider';
import { useParams } from 'next/navigation';
import { FiRefreshCw, FiHelpCircle, FiPhone, FiSearch, FiMoreVertical, FiSmile, FiPaperclip, FiMic, FiSend } from 'react-icons/fi';
import Avatar from '@/components/ui/Avatar';

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

  // Group messages by date
  const grouped = messages.reduce((acc, msg) => {
    if (!acc[msg.date]) acc[msg.date] = [];
    acc[msg.date].push(msg);
    return acc;
  }, {} as Record<string, typeof messages>);

  return (
    <div className="flex flex-col flex-1 h-full bg-[#f7f8fa]">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-white">
        <div className="flex items-center gap-4">
          <Avatar size={40} />
          <div>
            <div className="font-semibold text-lg text-gray-900">Test El Centro</div>
            <div className="text-xs text-gray-500">Roshnaq Airtel, Roshnaq Jio, Bharat Kumar Ramesh, Periskope</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <FiRefreshCw className="text-gray-400 cursor-pointer" size={20} title="Refresh" />
          <FiHelpCircle className="text-gray-400 cursor-pointer" size={20} title="Help" />
          <FiPhone className="text-gray-400 cursor-pointer" size={20} title="Phones" />
          <FiSearch className="text-gray-400 cursor-pointer" size={20} title="Search" />
          <FiMoreVertical className="text-gray-400 cursor-pointer" size={20} title="More" />
        </div>
      </div>
      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-8 py-6 bg-[url('/chat-bg.png')] bg-repeat bg-[length:400px_400px]">
        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div className="flex justify-center my-4">
              <span className="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full shadow">{date}</span>
            </div>
            {msgs.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'} mb-2`}>
                <div className={`rounded-lg px-4 py-2 max-w-md shadow text-sm ${msg.sender_id === user?.id ? 'bg-green-100 text-right text-gray-900' : 'bg-white text-left text-gray-800'}`}>
                  <div>{msg.content}</div>
                  <div className="text-xs text-gray-400 mt-1 text-right">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Message Input */}
      <div className="p-4 border-t bg-white flex items-center gap-2">
        <button className="text-gray-400 hover:text-green-600"><FiSmile size={22} /></button>
        <button className="text-gray-400 hover:text-green-600"><FiPaperclip size={22} /></button>
        <input
          type="text"
          placeholder="Message..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-200 bg-[#f7f8fa] focus:outline-none focus:ring-2 focus:ring-green-200"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="text-gray-400 hover:text-green-600"><FiMic size={22} /></button>
        <button className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2 transition"><FiSend size={20} /></button>
      </div>
    </div>
  );
}