"use client";

import { UserSentState } from "@components/ui/Contact";
import { BiCheckDouble } from "react-icons/bi";
import { MdCheck } from "react-icons/md";

/**
 * Props for the Message component
 * Handles both sent and received messages with various states and metadata
 */
interface MessageProps {
  text: string;
  time: string;
  date?: string;
  isSent: boolean;
  userSentState?: UserSentState;
  showHeader?: boolean;
  senderName?: string;
  phone?: string;
}

/**
 * Message component that displays a chat message with metadata
 * Supports sent/received states, read receipts, and sender information
 */
export const Message = ({
  text,
  time,
  date,
  isSent,
  userSentState,
  showHeader,
  senderName,
  phone
}: MessageProps) => {
  return (
    <>
      {/* Date Separator - only show when date is provided */}
      {date && (
        <div className="flex justify-center my-3">
          <time className="text-xs bg-gray-200 px-3 py-1 rounded-full text-gray-600">
            {date}
          </time>
        </div>
      )}

      {/* Message Container - aligns right for sent messages, left for received */}
      <div className={`flex ${isSent ? "justify-end" : "justify-start"} my-1`}>
        <article className="relative max-w-xs">
          {/* Message Bubble - green for sent messages, white for received */}
          <div
            className={`relative p-2 rounded-lg text-sm min-w-[7.5rem] ${
              isSent ? "bg-green-100 text-black" : "bg-white text-black"
            } shadow`}
          >
            {/* Sender Information Header */}
            {showHeader && senderName && (
              <header className="flex justify-between items-center h-4 mb-1">
                <span className="font-semibold text-green-600">{senderName}</span>
                {phone && (
                  <span className="text-xs ml-2 text-gray-500 break-all">{phone}</span>
                )}
              </header>
            )}

            <p className="break-words whitespace-pre-wrap">{text}</p>

            {/* Message Footer - shows time and message status indicators */}
            <footer className="flex items-center justify-end text-xs text-gray-500">
              <time>{time}</time>
              {isSent && (
                <>
                  {/* Message Status Indicators - single check for sent, double for delivered, blue double for read */}
                  {userSentState === UserSentState.SENT && (
                    <MdCheck className="text-gray-500 ml-1" aria-label="Sent" />
                  )}
                  {userSentState === UserSentState.RECEIVED && (
                    <BiCheckDouble className="text-gray-500 ml-1" aria-label="Delivered" />
                  )}
                  {userSentState === UserSentState.READ && (
                    <BiCheckDouble className="text-blue-500 ml-1" aria-label="Read" />
                  )}
                </>
              )}
            </footer>
          </div>
        </article>
      </div>
    </>
  );
};