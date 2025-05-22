"use client";

import { Contact, Message } from "@/components/utils/chatService";
import { ChatHeader } from "@/components/ui/ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { EmptyChat } from "./EmptyChat";
import { RefObject, useState } from "react";

/**
 * Props for the ChatArea component
 * Main container for chat functionality including messages, input and header
 */
interface ChatAreaProps {
  selectedContact: Contact | null;
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: () => void;
  userId?: string;
  username?: string;
  userAvatar?: string | null;
  userPhone?: string;
  messagesEndRef: RefObject<HTMLDivElement>;
  onMessagesViewed?: (messageIds: string[]) => void;
}

export const ChatArea = ({
  selectedContact,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  userId,
  username,
  userAvatar,
  userPhone,
  messagesEndRef,
  onMessagesViewed
}: ChatAreaProps) => {
  // Track if chat is scrolled to bottom to show/hide scroll button
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Track when user scrolls away from the bottom
  const handleScrollChange = (atBottom: boolean) => {
    setIsAtBottom(atBottom);
  };

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      <ChatHeader selectedContact={selectedContact} />

      {selectedContact ? (
        <>
          {/* Main chat message area */}
          <section className="flex-1 overflow-hidden">
            <MessageList
              messages={messages}
              userId={userId}
              selectedContactName={selectedContact.username}
              selectedContactPhone={selectedContact.phone}
              currentUserName={username}
              currentUserPhone={userPhone}
              messagesEndRef={messagesEndRef}
              onMessagesViewed={onMessagesViewed}
              onScrollChange={handleScrollChange}
            />
          </section>
          {/* Message input and controls footer */}
          <footer>
            <MessageInput
              message={newMessage}
              setMessage={setNewMessage}
              sendMessage={sendMessage}
              userName={username}
              userAvatar={userAvatar}
              scrollToBottom={scrollToBottom}
              showScrollButton={!isAtBottom}
            />
          </footer>
        </>
      ) : (
        <EmptyChat />
      )}
    </main>
  );
};