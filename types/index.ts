// User type for Supabase users table
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
}

// Chat type for chats table
export interface Chat {
  id: string;
  title: string;
  created_at: string;
}

// Message type for messages table
export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}