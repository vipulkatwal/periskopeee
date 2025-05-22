import { FiUsers } from 'react-icons/fi';
import Avatar from '../ui/Avatar';

/**
 * MemberAssign displays avatars of chat members and allows assigning new members.
 * Extend this to fetch and manage members from Supabase.
 */
export default function MemberAssign() {
  // Example static members (replace with dynamic data)
  const members = [
    { id: 1, avatar_url: undefined },
    { id: 2, avatar_url: undefined },
    { id: 3, avatar_url: undefined },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-1 text-sm font-semibold">
        <FiUsers className="text-gray-400" /> Members
      </div>
      <div className="flex -space-x-2">
        {members.map(member => (
          <Avatar key={member.id} src={member.avatar_url} size={28} />
        ))}
        {/* Add button for assigning new members */}
        <button
          className="ml-2 w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300"
          title="Add member"
        >
          +
        </button>
      </div>
    </div>
  );
}