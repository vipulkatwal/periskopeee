"use client";

import { Message as MessageType } from "@/components/utils/chatService";
import { Message } from "@/components/ui/Message";
import { UserSentState } from "@/components/ui/Contact";
import { RefObject, useEffect, useRef, useState } from "react";

interface MessageListProps {
  messages: MessageType[];
  userId?: string;
  selectedContactName?: string;
  selectedContactPhone?: string;
  currentUserName?: string;
  currentUserPhone?: string;
  messagesEndRef: RefObject<HTMLDivElement>;
  onMessagesViewed?: (messageIds: string[]) => void;
  onScrollChange?: (isAtBottom: boolean) => void;
}

/**
 * Formats a date string into a human readable format
 * Returns 'Today', 'Yesterday', or the localized date string
 */
const formatMessageDate = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const today = new Date();

  if (date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()) {
    return 'Today';
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString();
};

/**
 * Checks if two dates are on the same calendar day
 */
const isSameDay = (date1: string, date2: string): boolean => {
  if (!date1 || !date2) return false;

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

export const MessageList = ({
  messages,
  userId,
  selectedContactName,
  selectedContactPhone,
  currentUserName,
  currentUserPhone,
  messagesEndRef,
  onMessagesViewed,
  onScrollChange
}: MessageListProps) => {
  // Track which messages have been viewed
  const [viewedMessages, setViewedMessages] = useState<Set<string>>(new Set());
  const [isAtBottom, setIsAtBottom] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const messageRefs = useRef<Map<string, HTMLElement>>(new Map());
  const containerRef = useRef<HTMLElement>(null);

  // Track if user has scrolled away from bottom
  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // Consider "at bottom" if within 100px of the bottom
    const isBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsAtBottom(isBottom);

    // Notify parent component about scroll position
    if (onScrollChange) {
      onScrollChange(isBottom);
    }
  };

  // Set up intersection observer to track message visibility
  useEffect(() => {
    if (!userId || !onMessagesViewed) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newlyViewedMessages: string[] = [];

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-message-id');
            if (messageId && !viewedMessages.has(messageId)) {
              newlyViewedMessages.push(messageId);
              setViewedMessages(prev => new Set([...prev, messageId]));
            }
          }
        });

        if (newlyViewedMessages.length > 0 && onMessagesViewed) {
          onMessagesViewed(newlyViewedMessages);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );

    messageRefs.current.forEach((element) => {
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [userId, onMessagesViewed, messages, viewedMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    setIsAtBottom(true);
  }, [messages, messagesEndRef]);

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 h-full bg-stone-50"
      style={{
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        backgroundImage: "url('/doodle.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto'
      }}
      aria-label="Message conversation"
    >
      <div className="flex flex-col min-h-full">
        <div className="flex-1">
          {messages.map((msg, index) => {
            const showDate = index === 0 || !isSameDay(msg.created_at, messages[index - 1].created_at);
            const dateText = showDate ? formatMessageDate(msg.created_at) : undefined;

            // Determine if this is the first message in a group from the same sender
            const isFirstInGroup = index === 0 ||
              messages[index - 1].sender_id !== msg.sender_id ||
              showDate;

            return (
              <article
                key={msg.id}
                className={showDate && dateText ? "date-section" : ""}
                ref={el => {
                  if (el && msg.receiver_id === userId && msg.status !== 'read') {
                    messageRefs.current.set(msg.id, el);
                  }
                }}
                data-message-id={msg.id}
              >
                {showDate && dateText && (
                  <header className="flex justify-center my-3">
                    <time className="text-xs bg-gray-200 px-3 py-1 rounded-full text-gray-600" dateTime={new Date(msg.created_at).toISOString().split('T')[0]}>
                      {dateText}
                    </time>
                  </header>
                )}
                <Message
                  text={msg.content}
                  time={new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  date={undefined}
                  isSent={msg.sender_id === userId}
                  userSentState={
                    msg.sender_id === userId
                      ? msg.status === 'read'
                        ? UserSentState.READ
                        : msg.status === 'received'
                          ? UserSentState.RECEIVED
                          : UserSentState.SENT
                      : undefined
                  }
                  showHeader={isFirstInGroup}
                  senderName={msg.sender_id === userId ? currentUserName : selectedContactName}
                  phone={msg.sender_id === userId ? currentUserPhone : selectedContactPhone}
                />
              </article>
            );
          })}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </section>
  );
};