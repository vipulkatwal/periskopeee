'use client'
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

/**
 * ChatFilter provides a search input to filter chats by title or label.
 * Debounced input is recommended for performance.
 */
export default function ChatFilter() {
  const [search, setSearch] = useState('');

  // TODO: Implement debounced search and pass value to ChatList via context or props

  return (
    <div className="relative">
      {/* Search input with icon */}
      <input
        type="text"
        placeholder="Search or filter chats"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full pl-10 pr-3 py-2 rounded bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-200"
      />
      {/* Search icon positioned inside the input */}
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
    </div>
  );
}