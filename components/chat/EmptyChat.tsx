"use client";

import { HiFolderArrowDown } from "react-icons/hi2";

// Component shown when no chat is selected in the main chat area
export const EmptyChat = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
      <HiFolderArrowDown size={48} className="mb-3" />
      <p className="text-xl font-medium mb-1">No chat selected</p>
      <p className="text-sm">Select a contact to start chatting</p>
    </div>
  );
};