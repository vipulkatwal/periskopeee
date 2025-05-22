// Validates phone number format: must start with optional +, followed by 10-15 digits, spaces or hyphens
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
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

// Generates a random US phone number in the format: +1 XXX-XXX-XXXX
export const generateRandomPhone = (): string => {
  const areaCode = Math.floor(Math.random() * 900) + 100; // 100-999
  const prefix = Math.floor(Math.random() * 900) + 100; // 100-999
  const lineNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  return `+1 ${areaCode}-${prefix}-${lineNumber}`;
};