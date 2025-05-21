export interface Chat {
  id: string;
  name: string;
  is_group: boolean;
  last_message_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
}