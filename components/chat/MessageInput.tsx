import { useState } from "react";
import { FaSmile, FaPaperclip, FaCamera, FaMicrophone, FaFile, FaChevronDown, FaPaperPlane } from "react-icons/fa";

const senders = [
  { name: "Periskope", icon: <FaSmile className="text-green-600" /> },
  // Add more senders if needed
];

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const [selectedSender, setSelectedSender] = useState(senders[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="w-full px-4 py-3 bg-white border-t border-gray-200 flex items-end gap-2">
      {/* Left: big green circle with icon */}
      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white text-xl mr-2">
        <FaSmile />
      </button>
      {/* Input and icons */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center bg-[#f7f8fa] rounded-2xl px-4 py-2 border border-gray-200">
          <input
            className="flex-1 bg-transparent outline-none text-base placeholder-gray-400"
            type="text"
            placeholder="Message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button className="mx-1 text-gray-500 hover:text-green-600">
            <FaPaperclip size={18} />
          </button>
          <button className="mx-1 text-gray-500 hover:text-green-600">
            <FaCamera size={18} />
          </button>
          <button className="mx-1 text-gray-500 hover:text-green-600">
            <FaFile size={18} />
          </button>
          <button className="mx-1 text-gray-500 hover:text-green-600">
            <FaMicrophone size={18} />
          </button>
        </div>
      </div>
      {/* Send button */}
      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white text-xl ml-2">
        <FaPaperPlane />
      </button>
      {/* Sender dropdown */}
      <div className="relative ml-2">
        <button
          className="flex items-center gap-2 px-3 py-1 rounded-xl border border-gray-200 bg-[#f7f8fa] text-sm font-medium text-gray-700 hover:bg-gray-100"
          onClick={() => setShowDropdown(v => !v)}
        >
          {selectedSender.icon}
          {selectedSender.name}
          <FaChevronDown className="ml-1" />
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
            {senders.map((sender, idx) => (
              <button
                key={idx}
                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  setSelectedSender(sender);
                  setShowDropdown(false);
                }}
              >
                {sender.icon}
                {sender.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}