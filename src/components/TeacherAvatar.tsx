import React, { useState, useEffect } from 'react';
import { getHebrewInitials, getAvatarColor } from '../utils/avatarUtils';

interface TeacherAvatarProps {
  imageUrl?: string | null;
  name: string;
  sizeClass?: string;
  textClass?: string;
  textClassName?: string;
  borderClassName?: string;
  className?: string;
  imgClassName?: string;
  alt?: string;
}

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  imageUrl,
  name,
  sizeClass = '',
  textClass = 'text-xl',
  textClassName,
  borderClassName = '',
  className = '',
  imgClassName = 'w-full h-full object-cover',
  alt
}) => {
  const [hasError, setHasError] = useState(false);

  // Reset error flag whenever the provided imageUrl changes
  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  const cleanUrl = imageUrl && typeof imageUrl === 'string' ? imageUrl.trim() : '';
  const showImage = Boolean(cleanUrl && !hasError);

  const colorInfo = getAvatarColor(name);
  const initials = getHebrewInitials(name);
  const computedTextClass = textClassName || textClass;

  return (
    <div className={`relative overflow-hidden flex items-center justify-center shrink-0 ${sizeClass} ${borderClassName} ${className}`}>
      {showImage ? (
        <img
          src={cleanUrl}
          alt={alt || name}
          className={imgClassName}
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center font-black select-none bg-gradient-to-br ${colorInfo.bg} ${colorInfo.text} ${computedTextClass} shadow-inner`}
        >
          {initials}
        </div>
      )}
    </div>
  );
};
