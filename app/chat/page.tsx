"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect, useRef, useState } from "react";
import { ChatService, Contact as ContactType, Message as MessageType } from "@/components/utils/chatService";
import Rightbar from "@/components/ui/Rightbar";
import { ContactsList } from "@/components/chat/ContactsList";
import { ChatArea } from "@/components/chat/ChatArea";
import { FiArrowLeft } from "react-icons/fi";

/**
 * Formats a date string into a relative date (Today, Yesterday) or full date
 */
const formatMessageDate = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const today = new Date();

  if (date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()) {
    return 'Today';
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString();
};

const ChatsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<ContactType | null>(null);
  const [, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ContactType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [showContactsOnMobile, setShowContactsOnMobile] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatService = useRef(new ChatService()).current;

  // Hide contacts list on mobile when a contact is selected
  useEffect(() => {
    if (selectedContact && window.innerWidth < 768) {
      setShowContactsOnMobile(false);
    }
  }, [selectedContact]);

  // Handle responsive layout changes on window resize
  useEffect(() => {
    const handleResize = () => {
      const wasDesktop = window.innerWidth >= 768;
      const isMobile = window.innerWidth < 768;

      if (wasDesktop && isMobile && selectedContact) {
        setSelectedContact(null);
        setShowContactsOnMobile(true);
      }
      else if (window.innerWidth >= 768) {
        setShowContactsOnMobile(true);
      }
      else if (window.innerWidth < 768 && selectedContact) {
        setShowContactsOnMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedContact]);

  // Load contacts when user is authenticated
  useEffect(() => {
    if (user?.id) {
      loadContacts();
    }
  }, [user?.id]);

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = chatService.subscribeToMessages(user.id, (newMessage) => {
      if (selectedContact &&
         (newMessage.sender_id === selectedContact.id || newMessage.receiver_id === selectedContact.id)) {
        setMessages(prev => [...prev, newMessage]);
      }

      loadContacts();
    }, (updatedMessage) => {
      if (selectedContact &&
         (updatedMessage.sender_id === selectedContact.id || updatedMessage.receiver_id === selectedContact.id)) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === updatedMessage.id ? updatedMessage : msg
          )
        );
      }

      loadContacts();
    });

    return () => {
      chatService.unsubscribeFromMessages();
    };
  }, [user?.id, selectedContact]);

  // Load messages when a contact is selected
  useEffect(() => {
    if (user?.id && selectedContact) {
      loadMessages(selectedContact.id);
    }
  }, [user?.id, selectedContact]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Load contacts with retry logic for handling permission issues
  const loadContacts = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setPermissionError(false);
    try {
      let attempts = 0;
      let contactsList: ContactType[] = [];
      let permissionIssue = false;

      while (attempts < 3) {
        try {
          contactsList = await chatService.getContacts(user.id);
          break;
        } catch (error: any) {
          console.log(`Attempt ${attempts + 1} failed, retrying...`);
          attempts++;

          if (error?.message?.includes('permission denied')) {
            permissionIssue = true;
          }

          if (attempts < 3) {
            await sleep(1000);
          }
        }
      }

      if (permissionIssue) {
        setPermissionError(true);
      }

      setContacts(contactsList);
    } catch (error: any) {
      console.error("Error loading contacts:", error);
      if (error?.message?.includes('permission denied')) {
        setPermissionError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load chat messages for selected contact
  const loadMessages = async (contactId: string) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const messagesList = await chatService.getMessages(user.id, contactId);
      setMessages(messagesList);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a new message to selected contact
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || !user?.id) return;

    try {
      const sentMessage = await chatService.sendMessage(
        user.id,
        selectedContact.id,
        newMessage.trim()
      );

      if (sentMessage) {
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage("");

        loadContacts();

        if (selectedContact) {
          const now = new Date().toISOString();
          const updatedContact = {
            ...selectedContact,
            latestMessage: newMessage.trim(),
            lastMessageDate: formatMessageDate(now),
            lastMessageTimestamp: now
          };
          setSelectedContact(updatedContact);

          // Update contacts list with new message
          setContacts(prevContacts => {
            const filteredContacts = prevContacts.filter(c => c.id !== selectedContact.id);
            const updatedContacts = [updatedContact, ...filteredContacts];
            return updatedContacts.sort((a, b) => {
              if (!a.lastMessageTimestamp) return 1;
              if (!b.lastMessageTimestamp) return -1;
              return new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime();
            });
          });
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle contact selection and mobile view
  const handleContactSelect = (contact: ContactType) => {
    setSelectedContact(contact);
    if (window.innerWidth < 768) {
      setShowContactsOnMobile(false);
    }
    setIsSearching(false);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleContactDeselect = () => {
    setSelectedContact(null);
    setShowContactsOnMobile(true);
  };

  // Search for users to add as contacts
  const handleSearchUsers = async () => {
    if (!searchQuery.trim() || !user?.id) return;

    setIsLoading(true);
    try {
      const results = await chatService.searchUsers(searchQuery, user.id);
      setSearchResults(results);
      setIsSearching(true);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new contact
  const handleAddContact = async (contactId: string) => {
    if (!user?.id) return;

    try {
      const success = await chatService.addContact(user.id, contactId);
      if (success) {
        loadContacts();
        setIsSearching(false);
        setSearchResults([]);
        setSearchQuery("");
      }
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  // Mark messages as read when viewed
  const handleMessagesViewed = async (messageIds: string[]) => {
    if (!user?.id || !selectedContact || messageIds.length === 0) return;

    const messagesToMark = messages
      .filter(msg =>
        messageIds.includes(msg.id) &&
        msg.sender_id === selectedContact.id &&
        msg.receiver_id === user.id &&
        msg.status !== 'read'
      )
      .map(msg => msg.id);

    if (messagesToMark.length > 0) {
      await chatService.markSpecificMessagesAsRead(messagesToMark);
    }
  };

  const handleBackToContacts = () => {
    handleContactDeselect();
  };

  return (
    <div className="flex h-full relative">
      <div className={`${!showContactsOnMobile ? 'hidden md:block' : 'block'} w-full md:w-80 lg:w-96 h-full overflow-hidden`}>
        <ContactsList
          contacts={contacts}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchUsers={handleSearchUsers}
          handleContactSelect={handleContactSelect}
          handleContactDeselect={handleContactDeselect}
          handleAddContact={handleAddContact}
          selectedContact={selectedContact}
          searchResults={searchResults}
          isSearching={isSearching}
          permissionError={permissionError}
          loadContacts={loadContacts}
        />
      </div>

      <div className={`${showContactsOnMobile ? 'hidden md:flex' : 'flex'} flex-col flex-1 h-full overflow-hidden`}>
        {selectedContact && (
          <div className="md:hidden absolute top-16 left-3 z-10">
            <button
              onClick={handleBackToContacts}
              className="p-2 rounded-full bg-white shadow-md"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}

        <ChatArea
          selectedContact={selectedContact}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
          userId={user?.id}
          username={profile?.username}
          userAvatar={profile?.avatar_url}
          userPhone={profile?.phone || undefined}
          messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
          onMessagesViewed={handleMessagesViewed}
        />
      </div>

      {selectedContact && (
        <div className={`${showContactsOnMobile ? 'hidden md:block' : 'block'} h-full overflow-hidden`}>
          <Rightbar contact={selectedContact} />
        </div>
      )}
    </div>
  );
};

export default ChatsPage;