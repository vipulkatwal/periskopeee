import { createBrowserSupabaseClient } from "./supabase-client";

const supabase = createBrowserSupabaseClient();

// Message type (matches Supabase schema)
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  status: 'sent' | 'received' | 'read';
  created_at: string;
}

/**
 * Sends a message to a chat (to a specific receiver).
 */
export async function sendMessage(senderId: string, receiverId: string, content: string) {
  const { data, error } = await supabase.from("messages").insert([
    { sender_id: senderId, receiver_id: receiverId, content, status: 'sent' }
  ]).select();
  if (error) throw error;
  return data ? data[0] : null;
}

/**
 * Fetches all messages between the user and a contact, ordered by created_at ascending.
 */
export async function getMessages(userId: string, contactId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${userId})`)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

/**
 * Subscribes to new messages between the user and a contact. Calls callback with the new message.
 * Returns the subscription object so you can unsubscribe.
 */
export function subscribeToMessages(userId: string, contactId: string, callback: (message: Message) => void) {
  const channel = supabase
    .channel('messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
      const msg = payload.new as Message;
      // Only call callback if the message is between these two users
      if (
        (msg.sender_id === userId && msg.receiver_id === contactId) ||
        (msg.sender_id === contactId && msg.receiver_id === userId)
      ) {
        callback(msg);
      }
    })
    .subscribe();
  return channel;
}