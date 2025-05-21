import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
}

/**
 * Avatar component displays a user's profile image or a default icon.
 */
const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Avatar', size = 32 }) => {
  return (
    <img
      src={src || '/default-avatar.png'}
      alt={alt}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
};

export default Avatar;
