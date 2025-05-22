import { FaCheck, FaCheckDouble } from "react-icons/fa";
import clsx from "clsx";

interface ChatBubbleProps {
  sender: string;
  message: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  isSelf?: boolean;
  meta?: string; // phone or email
}

/**
 * ChatBubble displays a single chat message, styled for sender or receiver.
 * For date separators, render a separate component between bubbles.
 */
export default function ChatBubble({
  sender,
  message,
  timestamp,
  status = "sent",
  isSelf = false,
  meta,
}: ChatBubbleProps) {
  return (
    <div className={clsx("flex w-full mb-2", isSelf ? "justify-end" : "justify-start")}>
      <div className={clsx(
        "flex flex-col max-w-[70%]",
        isSelf ? "items-end" : "items-start"
      )}>
        {/* Sender and meta info */}
        <div className="flex items-center gap-2 mb-1">
          <span className={clsx(
            "font-semibold text-xs",
            isSelf ? "text-green-700" : "text-blue-700"
          )}>{sender}</span>
          {meta && (
            <span className="text-[11px] text-gray-400">{meta}</span>
          )}
        </div>
        {/* Message bubble */}
        <div className={clsx(
          "rounded-xl px-4 py-2 shadow-sm relative",
          isSelf ? "bg-green-100" : "bg-white border border-gray-100"
        )}>
          <p className="text-sm text-gray-900 whitespace-pre-line">{message}</p>
          {/* Timestamp and status */}
          <div className="flex items-center gap-1 absolute right-2 bottom-1 text-[11px] text-gray-500">
            <span>{timestamp}</span>
            {isSelf && status === "sent" && <FaCheck size={12} />}
            {isSelf && status === "delivered" && <FaCheckDouble size={12} />}
            {isSelf && status === "read" && <FaCheckDouble size={12} className="text-green-600" />}
          </div>
        </div>
      </div>
    </div>
  );
}