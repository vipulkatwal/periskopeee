import { FaSyncAlt, FaQuestionCircle, FaMobileAlt, FaSearch } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";

const users = [
  { name: "H", color: "bg-green-500" },
  { name: "R", color: "bg-blue-500" },
  { name: "B", color: "bg-yellow-500" },
  { name: "K", color: "bg-purple-500" },
];

export default function Rightbar() {
  return (
    <aside className="w-24 flex flex-col items-center py-4 border-l border-gray-200 bg-white h-full">
      {/* Top: Device status */}
      <div className="flex flex-col items-center mb-6">
        <span className="text-xs text-gray-500 mb-1">5 / 6 phones</span>
        <div className="flex -space-x-2">
          {users.map((user, idx) => (
            <div
              key={idx}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white ${user.color}`}
            >
              {user.name}
            </div>
          ))}
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold border-2 border-white text-gray-700">
            +3
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-4 items-center">
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
          <FaSyncAlt size={18} />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
          <FaQuestionCircle size={18} />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
          <FaMobileAlt size={18} />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
          <FaSearch size={18} />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
          <FiMoreVertical size={18} />
        </button>
      </div>
    </aside>
  );
}