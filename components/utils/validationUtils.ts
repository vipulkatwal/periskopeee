// Validates phone number format: must start with optional +91, followed by 10 digits, spaces or hyphens allowed
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+91[\s-]?\d{5}[\s-]?\d{5}$/;
  return phoneRegex.test(phone);
};

// Validates email format: something@something.something
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validates password: must be at least 6 characters long
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Validates username: must be between 3 and 30 characters
export const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 30;
};

// Generates a random Indian phone number in the format: +91 XXXXX-XXXXX
export const generateRandomPhone = (): string => {
  const first = Math.floor(Math.random() * 90000) + 10000; // 10000-99999
  const second = Math.floor(Math.random() * 90000) + 10000; // 10000-99999
  return `+91 ${first}-${second}`;
};