// Database type definitions for Supabase tables
export type Database = {
  public: {
    Tables: {
      // User profiles table containing basic user information
      profiles: {
        Row: {
          id: string;              // Unique identifier for the user
          username: string;        // User's display name
          avatar_url: string | null; // URL to user's profile picture
          phone: string | null;    // User's phone number
          updated_at: string | null; // Last update timestamp
          created_at: string;      // Account creation timestamp
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          phone?: string | null;
          updated_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          phone?: string | null;
          updated_at?: string | null;
        };
      };
      // Messages table for storing chat messages between users
      messages: {
        Row: {
          id: string;             // Unique identifier for the message
          sender_id: string;      // ID of user sending the message
          receiver_id: string;    // ID of user receiving the message
          content: string;        // Message content
          created_at: string;     // Message timestamp
          status: 'sent' | 'received' | 'read'; // Message delivery status
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at?: string;
          status?: 'sent' | 'received' | 'read';
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          created_at?: string;
          status?: 'sent' | 'received' | 'read';
        };
      };
      // Contacts table for managing user connections
      contacts: {
        Row: {
          id: string;            // Unique identifier for the contact relationship
          user_id: string;       // ID of the user who owns this contact
          contact_id: string;    // ID of the user who is the contact
          created_at: string;    // When the contact was added
        };
        Insert: {
          id?: string;
          user_id: string;
          contact_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          contact_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;      // No views defined
    };
    Functions: {
      [_ in never]: never;      // No functions defined
    };
    Enums: {
      [_ in never]: never;      // No enums defined
    };
  };
};