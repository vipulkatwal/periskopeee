import React from 'react';
import type { Chat, Message, Profile } from '../../../types';
import HeaderBar from './HeaderBar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  selectedChat: Chat | null;
  messages: Message[];
  profiles: Record<string, Profile>;
  messagesLoading: boolean;
  newMessage: string;
  sending: boolean;
  onSendMessage: (e: React.FormEvent) => void;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ChatWindow({
  selectedChat,
  messages,
  profiles,
  messagesLoading,
  newMessage,
  sending,
  onSendMessage,
  onMessageChange,
}: ChatWindowProps) {
  return (
    <main className="flex-1 flex flex-col">
      <HeaderBar selectedChat={selectedChat} />
      <div className="flex-1 p-4 overflow-y-auto">
        <MessageList
          messages={messages}
          profiles={profiles}
          messagesLoading={messagesLoading}
          selectedChat={selectedChat}
        />
      </div>
      <MessageInput
        value={newMessage}
        onChange={onMessageChange}
        onSend={onSendMessage}
        disabled={!selectedChat || sending}
        sending={sending}
      />
    </main>
  );
}