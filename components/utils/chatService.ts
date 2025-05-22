import { Database } from '@/types/supabase';
import { createBrowserSupabaseClient } from './supabase-client';
import { UserSentState } from '@/components/ui/Contact';

/**
 * Utility function to format dates into relative strings like "Today" or "Yesterday"
 * @param dateString - ISO date string to format
 * @returns Formatted date string
 */
const formatMessageDate = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const today = new Date();

  // Check if the date is today
  if (date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()) {
    return 'Today';
  }

  // Check if the date is yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()) {
    return 'Yesterday';
  }

  // Otherwise, return the localized date
  return date.toLocaleDateString();
};

/**
 * Represents a chat message with sender, receiver, content and status
 */
export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  status: 'sent' | 'received' | 'read';
};

/**
 * Represents a chat contact with their profile info and latest message details
 */
export type Contact = {
  id: string;
  username: string;
  avatar_url: string | null;
  phone?: string;
  latestMessage?: string;
  unreadCount?: number;
  userSentState?: UserSentState;
  lastMessageDate?: string;
  lastMessageTimestamp?: string; // Used for sorting contacts by most recent message
};

/**
 * Service class that handles all chat-related operations with Supabase
 */
export class ChatService {
  private supabase = createBrowserSupabaseClient();
  private messageSubscription: any = null; // Stores active message subscription
  private permissionIssue = false; // Tracks if user has DB permission issues

  /**
   * Verifies the user is authenticated with Supabase
   * @returns Promise<boolean> indicating auth status
   */
  async ensureAuthenticated(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      if (error) {
        console.error('Authentication error:', error.message);
        return false;
      }
      return !!data.session;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Fetches all contacts for a given user, including their latest message info
   * @param userId - ID of user to fetch contacts for
   * @returns Promise<Contact[]> Array of contacts with message details
   */
  async getContacts(userId: string): Promise<Contact[]> {
    if (!userId) {
      console.error('Cannot fetch contacts: userId is empty');
      return [];
    }

    // Skip profile check if we've already encountered permission issues
    if (this.permissionIssue) {
      return [];
    }

    try {
      // First make sure the user is authenticated
      const isAuthenticated = await this.ensureAuthenticated();
      if (!isAuthenticated) {
        console.error('User is not authenticated');
        return [];
      }

      // Test DB permissions with a simple query first
      try {
        const { error } = await this.supabase
          .from('profiles')
          .select('count')
          .limit(1);

        if (error) {
          console.error('Permission check failed:', error.message);
          this.permissionIssue = true;
          return [];
        }
      } catch (error) {
        console.error('Error during permission check:', error);
        this.permissionIssue = true;
        return [];
      }

      // Verify user exists in profiles table
      const { data: profileData, error: profileError } = await this.supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error checking user profile:', profileError);
        // If we can't find the profile, return empty array
        return [];
      }

      // Get user's contacts from contacts table
      const { data: contactsData, error: contactsError } = await this.supabase
        .from('contacts')
        .select('contact_id')
        .eq('user_id', userId);

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError.message, contactsError.details, contactsError.hint);
        return [];
      }

      // No contacts found
      if (!contactsData || contactsData.length === 0) {
        return [];
      }

      // Get full profile info for each contact
      const contactIds = contactsData.map(contact => contact.contact_id);
      const { data: profilesData, error: profilesError } = await this.supabase
        .from('profiles')
        .select('*')
        .in('id', contactIds);

      if (profilesError) {
        console.error('Error fetching contact profiles:', profilesError.message);
        return [];
      }

      // Fetch latest message and unread count for each contact
      const contacts = await Promise.all(
        profilesData.map(async (profile) => {
          // Get latest message between current user and this contact
          const { data: messageData } = await this.supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
            .order('created_at', { ascending: false })
            .limit(1);

          // Count unread messages from this contact
          const { count: unreadCount } = await this.supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', profile.id)
            .eq('receiver_id', userId)
            .eq('status', 'received');

          const latestMessage = messageData && messageData[0] ? messageData[0].content : '';
          const lastMessageDate = messageData && messageData[0] ? formatMessageDate(messageData[0].created_at) : '';
          const lastMessageTimestamp = messageData && messageData[0] ? messageData[0].created_at : '';

          // Determine message status for UI (sent, received, read)
          let userSentState: UserSentState | undefined;
          if (messageData && messageData[0]) {
            if (messageData[0].sender_id === userId) {
              userSentState = messageData[0].status === 'read'
                ? UserSentState.READ
                : messageData[0].status === 'received'
                  ? UserSentState.RECEIVED
                  : UserSentState.SENT;
            }
          }

          return {
            id: profile.id,
            username: profile.username,
            avatar_url: profile.avatar_url,
            phone: profile.phone || '+1 555-123-4567', // Fallback phone number if none stored
            latestMessage,
            unreadCount: unreadCount || 0,
            userSentState,
            lastMessageDate,
            lastMessageTimestamp,
          };
        })
      );

      // Sort contacts by most recent message first
      const sortedContacts = contacts.sort((a, b) => {
        if (!a.lastMessageTimestamp) return 1; // No timestamp moves to end
        if (!b.lastMessageTimestamp) return -1;
        return new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime();
      });

      return sortedContacts;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  }

  /**
   * Fetches all messages between two users
   * @param userId - Current user's ID
   * @param contactId - Contact's ID to fetch messages with
   * @returns Promise<Message[]> Array of messages in chronological order
   */
  async getMessages(userId: string, contactId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .or(`sender_id.eq.${contactId},receiver_id.eq.${contactId}`)
      .order('created_at');

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Sends a new message to a contact
   * @param senderId - ID of message sender
   * @param receiverId - ID of message recipient
   * @param content - Message content
   * @returns Promise<Message | null> The sent message or null if failed
   */
  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message | null> {
    const { data, error } = await this.supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        status: 'sent',
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    return data;
  }

  /**
   * Sets up real-time subscription for new messages and status changes
   * @param userId - User to subscribe to messages for
   * @param onNewMessage - Callback for new messages
   * @param onMessageStatusChange - Callback for message status updates
   * @returns Cleanup function to unsubscribe
   */
  subscribeToMessages(
    userId: string,
    onNewMessage: (message: Message) => void,
    onMessageStatusChange: (message: Message) => void
  ) {
    // Cleanup any existing subscription
    this.unsubscribeFromMessages();

    this.messageSubscription = this.supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          // Auto-update status to received
          this.supabase
            .from('messages')
            .update({ status: 'received' })
            .eq('id', newMessage.id)
            .then(() => {
              onNewMessage(newMessage);
            });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const updatedMessage = payload.new as Message;
          onMessageStatusChange(updatedMessage);
        }
      )
      .subscribe();

    return () => this.unsubscribeFromMessages();
  }

  /**
   * Removes active message subscription
   */
  unsubscribeFromMessages() {
    if (this.messageSubscription) {
      this.supabase.removeChannel(this.messageSubscription);
      this.messageSubscription = null;
    }
  }

  /**
   * Adds a new contact relationship between users
   * @param userId - User adding the contact
   * @param contactId - User being added as contact
   * @returns Promise<boolean> Success status
   */
  async addContact(userId: string, contactId: string): Promise<boolean> {
    // Check if contact already exists
    const { data: existingContact } = await this.supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('contact_id', contactId)
      .single();

    if (existingContact) {
      return true; // Contact already exists
    }

    // Add new contact relationship
    const { error } = await this.supabase
      .from('contacts')
      .insert({
        user_id: userId,
        contact_id: contactId,
      });

    return !error;
  }

  /**
   * Searches for users by username
   * @param query - Search query string
   * @param currentUserId - Current user's ID to exclude from results
   * @returns Promise<Contact[]> Matching users
   */
  async searchUsers(query: string, currentUserId: string): Promise<Contact[]> {
    if (!query) return [];

    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${query}%`)
      .neq('id', currentUserId)
      .limit(10);

    if (error) {
      console.error('Error searching users:', error);
      return [];
    }

    return data.map(profile => ({
      id: profile.id,
      username: profile.username,
      avatar_url: profile.avatar_url,
    }));
  }

  /**
   * Marks all messages in a conversation as read
   * @param userId - ID of message recipient
   * @param contactId - ID of message sender
   */
  async markMessagesAsRead(userId: string, contactId: string): Promise<void> {
    const { error } = await this.supabase
      .from('messages')
      .update({ status: 'read' })
      .eq('sender_id', contactId)
      .eq('receiver_id', userId)
      .not('status', 'eq', 'read');

    if (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  /**
   * Marks specific messages as read by their IDs
   * @param messageIds - Array of message IDs to mark as read
   */
  async markSpecificMessagesAsRead(messageIds: string[]): Promise<void> {
    if (messageIds.length === 0) return;

    const { error } = await this.supabase
      .from('messages')
      .update({ status: 'read' })
      .in('id', messageIds);

    if (error) {
      console.error('Error marking specific messages as read:', error);
    }
  }
}