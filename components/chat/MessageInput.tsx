"use client";

import React from "react";
import { IoArrowDown, IoSend } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import {
  GenerateOutlineIcon,
  TextFileIcon,
} from "@/components/ui/Icons";
import { FiPaperclip } from "react-icons/fi";
import { FaMicrophone, FaRegClock } from "react-icons/fa6";
import { AiOutlineHistory } from "react-icons/ai";
import { LuChevronsUpDown } from "react-icons/lu";
import Image from "next/image";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: () => void;
  userAvatar?: string | null;
  userName?: string | null;
  scrollToBottom?: () => void;
  showScrollButton?: boolean;
}

export const MessageInput = ({
  message,
  setMessage,
  sendMessage,
  userAvatar,
  userName,
  scrollToBottom,
  showScrollButton = false,
}: MessageInputProps) => {

  // Handle form submission and send message if not empty
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage();
    }
  };

  return (
    <>
      {/* Scroll down button - only shown when not at bottom of chat */}
      {showScrollButton && (
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 z-10">
            <button
              onClick={scrollToBottom}
              className="w-9 h-6 rounded-md bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
              aria-label="Scroll to bottom"
            >
              <IoArrowDown className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 py-2.5">
        <form onSubmit={handleSubmit} className="flex items-center px-2 sm:px-4 mx-auto">
          <input
            type="text"
            className="flex-1 py-2 sm:py-2.5 px-3 font-medium sm:px-4 rounded-3xl text-md h-10 focus:outline-none"
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-label="Type a message"
          />
          <button
            type="submit"
            className="ml-2 p-1 text-green-700"
            disabled={!message.trim()}
            aria-label="Send message"
          >
            <IoSend className="h-6 w-6" />
          </button>
        </form>

        {/* Message actions toolbar */}
        <nav className="flex items-center justify-between px-2 sm:px-4 mt-2 ml-3.5 sm:mt-3 mx-auto">
          <ul className="flex space-x-4 sm:space-x-7 overflow-x-auto pb-1 scrollbar-hide">
            <li>
              <button className="focus:outline-none flex-shrink-0 cursor-pointer" aria-label="Attach file">
                <FiPaperclip className="h-4 w-4 text-gray-700" />
              </button>
            </li>
            <li>
              <button className="focus:outline-none flex-shrink-0 cursor-pointer" aria-label="Emoji">
                <BsEmojiSmile className="h-4 w-4 text-gray-700" />
              </button>
            </li>
            <li className="hidden sm:block">
              <button className="focus:outline-none flex-shrink-0 cursor-pointer" aria-label="Schedule message">
                <FaRegClock className="h-4 w-4 text-gray-700" />
              </button>
            </li>
            <li>
              <button className="focus:outline-none flex-shrink-0 cursor-pointer" aria-label="History">
                <AiOutlineHistory className="h-4 w-4 text-gray-700" />
              </button>
            </li>
            <li>
              <button className="focus:outline-none flex-shrink-0 cursor-pointer" aria-label="Generate">
                <GenerateOutlineIcon className="h-4 w-4 text-gray-700" />
              </button>
            </li>
            <li className="hidden sm:block">
              <button className="focus:outline-none flex-shrink-0 cursor-pointer" aria-label="Attach document">
                <TextFileIcon className="h-4 w-4 text-gray-700" />
              </button>
            </li>
            <li>
              <button className="focus:outline-none flex-shrink-0 cursor-pointer" aria-label="Voice message">
                <FaMicrophone className="h-4 w-4 text-gray-700" />
              </button>
            </li>
          </ul>

          {/* User profile button */}
          <button className="flex items-center px-1 py-0.5 ml-2 text-black text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition whitespace-nowrap cursor-pointer" aria-label="User profile">
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt={userName || "User"}
                width={16}
                height={16}
                className="rounded-full mr-2"
              />
            ) : (
              <span className="h-4 w-4 bg-yellow-400 rounded-full mr-2" />
            )}
            {userName || "User"}
            <LuChevronsUpDown className="ml-1 lg:ml-5 h-3 w-3" />
          </button>
        </nav>
      </div>
    </>
  );
};