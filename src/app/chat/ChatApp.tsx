"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FiSearch, FiFilter, FiUser, FiTag, FiUsers } from "react-icons/fi";
import type { Chat, Message, Profile } from "./types";

export default function ChatApp() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});

  // Fetch current user and their profile
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) {
        setUserId(null);
        setUserProfile(null);
        return;
      }
      setUserId(user.id);
      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .eq("id", user.id)
        .single();
      setUserProfile(profile || null);
    };
    fetchUser();
  }, []);

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) {
        setChats([]);
        setUserId(null);
        setLoading(false);
        return;
      }
      setUserId(user.id);
      const { data, error } = await supabase
        .from("chat_members")
        .select("chat_id, chats(id, name, is_group, last_message_at, created_at)")
        .eq("user_id", user.id);
      if (error) {
        setChats([]);
      } else {
        setChats(
          ((data as any[] || [])
            .map((cm) => Array.isArray(cm.chats) ? cm.chats[0] : cm.chats)
            .filter((c: Chat | null) => c !== null))
        );
      }
      setLoading(false);
    };
    fetchChats();
  }, []);

  // Fetch messages and sender profiles
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      setProfiles({});
      return;
    }
    const fetchMessages = async () => {
      setMessagesLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("id, user_id, content, created_at")
        .eq("chat_id", selectedChat.id)
        .order("created_at", { ascending: true });
      if (error) {
        setMessages([]);
        setProfiles({});
      } else {
        setMessages(data || []);
        // Fetch all unique sender profiles
        const userIds = Array.from(new Set((data || []).map((m: Message) => m.user_id)));
        if (userIds.length > 0) {
          const { data: profs } = await supabase
            .from("profiles")
            .select("id, name, avatar_url")
            .in("id", userIds);
          const profMap: Record<string, Profile> = {};
          (profs || []).forEach((p: Profile) => {
            profMap[p.id] = p;
          });
          setProfiles(profMap);
        } else {
          setProfiles({});
        }
      }
      setMessagesLoading(false);
    };
    fetchMessages();

    // Real-time subscription for new messages
    const channel = supabase
      .channel('messages:realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${selectedChat.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((msgs) => [...msgs, newMsg]);
          // Fetch sender profile if not already cached
          if (!profiles[newMsg.user_id]) {
            supabase
              .from("profiles")
              .select("id, name, avatar_url")
              .eq("id", newMsg.user_id)
              .single()
              .then(({ data: p }) => {
                if (p) setProfiles((prev) => ({ ...prev, [p.id]: p }));
              });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChat]);

  // Send message handler
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !newMessage.trim() || !userId) return;
    setSending(true);
    const content = newMessage.trim();
    setNewMessage("");
    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      user_id: userId,
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((msgs) => [...msgs, optimisticMsg]);
    // Insert into Supabase
    const { data, error } = await supabase
      .from("messages")
      .insert({ chat_id: selectedChat.id, user_id: userId, content })
      .select("id, user_id, content, created_at")
      .single();
    if (!error && data) {
      setMessages((msgs) =>
        msgs.map((msg) => (msg.id === tempId ? data : msg))
      );
    } else {
      // Remove optimistic message on error
      setMessages((msgs) => msgs.filter((msg) => msg.id !== tempId));
      alert("Failed to send message");
    }
    setSending(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
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
                onClick={() => setSelectedChat(chat)}
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

      {/* Main Chat Window */}
      <main className="flex-1 flex flex-col">
        <header className="p-4 border-b bg-white flex items-center">
          <span className="font-bold text-lg">
            {selectedChat ? selectedChat.name : "Select a chat"}
          </span>
        </header>
        <div className="flex-1 p-4 overflow-y-auto">
          {messagesLoading ? (
            <div className="text-gray-400">Loading messages...</div>
          ) : !selectedChat ? (
            <div className="text-gray-400">Select a chat to view messages</div>
          ) : messages.length === 0 ? (
            <div className="text-gray-400">No messages yet</div>
          ) : (
            <ul className="space-y-2">
              {messages.map((msg) => {
                const sender = profiles[msg.user_id];
                return (
                  <li key={msg.id} className="bg-white p-2 rounded shadow-sm flex gap-3 items-start">
                    {sender?.avatar_url ? (
                      <img
                        src={sender.avatar_url}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-lg text-white">
                        <FiUser />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-800">{sender?.name || "User"}</span>
                        <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="text-sm text-gray-700 mt-0.5">{msg.content}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <form className="p-4 border-t bg-white flex gap-2" onSubmit={handleSendMessage}>
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Type a message"
            disabled={!selectedChat || sending}
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={!selectedChat || !newMessage.trim() || sending}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </main>
    </div>
  );
}