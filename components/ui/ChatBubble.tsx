import clsx from 'clsx';

/**
 * ChatBubble displays a single message, styled for sender or receiver.
 */
interface ChatBubbleProps {
  content: string;
  isSender: boolean;
  timestamp?: string;
}

export default function ChatBubble({ content, isSender, timestamp }: ChatBubbleProps) {
  return (
    <div className={clsx(
      "flex items-end mb-2",
      isSender ? "justify-end" : "justify-start"
    )}>
      <div className={clsx(
        "rounded-lg px-4 py-2 max-w-xs shadow",
        isSender
          ? "bg-green-100 text-right text-gray-900"
          : "bg-white text-left text-gray-800"
      )}>
        <div>{content}</div>
        {timestamp && (
          <div className="text-xs text-gray-400 mt-1 text-right">{timestamp}</div>
        )}
      </div>
    </div>
  );
}