"use client";

import React from "react";
import { Contact } from "@/components/utils/chatService";
import { IoPersonSharp } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { GenerateIcon } from "@/components/ui/Icons";
import Image from "next/image";

interface ChatHeaderProps {
  selectedContact: Contact | null;
}

export const ChatHeader = ({ selectedContact }: ChatHeaderProps) => {
  // This function will be implemented later to handle message search
  const handleSearch = () => {
    console.log("Search functionality to be implemented");
    // Future implementation: Open search modal or toggle search input
  };

  return (
    <div className="flex items-center justify-between h-14 px-2 sm:px-3 border-b border-gray-200 bg-white">
      {/* Left side - Contact info section */}
      <div className="flex items-center">
        {selectedContact ? (
          <>
            {/* Contact avatar - shows image if available, otherwise shows icon */}
            <div className="relative h-8 w-8 rounded-full flex items-center justify-center bg-gray-200 mr-2">
              {selectedContact.avatar_url ? (
                <Image
                  src={selectedContact.avatar_url}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <IoPersonSharp className="text-white h-3 w-3 sm:h-4 sm:w-4 text-sm" />
              )}
            </div>
            {/* Contact details - username and phone number */}
            <div className="flex flex-col max-w-[200px] sm:max-w-none">
              <h3 className="text-xs sm:text-sm font-semibold truncate">
                {selectedContact.username}
              </h3>
              <div className="text-xs font-normal text-gray-400 truncate">
                {selectedContact.phone || "Click here for contact info"}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      {/* Right side buttons - only visible when a chat is selected */}
      {selectedContact && (
        <div className="flex items-center space-x-2">
          {/* Generate button */}
          <div className="flex items-center">
            <div className="w-6 h-6 flex items-center justify-center ">
              <GenerateIcon className="h-4 w-4 text-gray-700 cursor-pointer" />
            </div>
          </div>
          {/* Search button */}
          <div className="relative">
            <button
              className="p-1.5 rounded-full text-gray-700 "
              onClick={handleSearch}
            >
              <FiSearch className="h-4 w-4 cursor-pointer" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};