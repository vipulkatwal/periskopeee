// Formats a date string to display 'Today', 'Yesterday', or the localized date
export const formatMessageDate = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const today = new Date();

  // Check if date is today
  if (date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()) {
    return 'Today';
  }

  // Check if date is yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString();
};

// Formats a date string to display time in HH:MM format
export const formatTime = (dateString: string): string => {
  if (!dateString) return '';

  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};