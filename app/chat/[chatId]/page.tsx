import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';

/**
 * Chat conversation page for a specific chat.
 * Renders the chat header, messages, and input box.
 */
export default function ChatConversationPage({ params }: { params: { chatId: string } }) {
  // params.chatId will be used to fetch chat data/messages
  return (
    <div className="flex flex-col flex-1 h-full">
      <ChatHeader chatId={params.chatId} />
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <MessageList chatId={params.chatId} />
      </div>
      <div className="p-4 border-t bg-white">
        <MessageInput chatId={params.chatId} />
      </div>
    </div>
  );
}