// Image helper utilities for handling missing images and placeholders

export const getAvatarUrl = (avatarUrl) => {
  if (!avatarUrl || avatarUrl === '/default-avatar.png') {
    return 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=150';
  }
  return avatarUrl;
};

export const getPlaceholderImage = (text = 'Image', size = 150) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&background=6366f1&color=fff&size=${size}`;
};

export const getStudyIcon = (size = 96) => {
  return `https://via.placeholder.com/${size}x${size}/6366f1/ffffff?text=📚`;
};
