// User type for Supabase users table
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
}

// Profile type for public.profiles table
export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  phone?: string;
  updated_at?: string;
  created_at: string;
}

// Chat type for chats table (if you add group chat support)
export interface Chat {
  id: string;
  title: string;
  created_at: string;
}

// Message type for messages table
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  status: 'sent' | 'received' | 'read';
  created_at: string;
}

// Contact type for contacts table
export interface Contact {
  id: string;
  user_id: string;
  contact_id: string;
  created_at: string;
}

// Label type (if you add chat labels)
export interface Label {
  id: string;
  name: string;
  color: string;
}

// ChatMember type (for group chat support, if needed)
export interface ChatMember {
  id: string;
  chat_id: string;
  user_id: string;
  created_at: string;
}