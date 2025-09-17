import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative
        p-2
        rounded-full
        text-white
        transition-all
        duration-300
        ease-in-out
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-primary-500
        group
        
        // Base state
        bg-gradient-to-br from-purple-500 to-blue-500
        shadow-lg
        
        // Hover state
        hover:scale-110
        hover:shadow-xl
        
        // Active state
        active:scale-95
        
        // Tooltip
        before:absolute
        before:bottom-full
        before:left-1/2
        before:-translate-x-1/2
        before:mb-2
        before:px-3
        before:py-1
        before:text-xs
        before:font-medium
        before:text-white
        before:bg-gray-800
        before:rounded-md
        before:opacity-0
        before:transition-opacity
        before:duration-200
        before:content-[attr(data-tooltip)]
        group-hover:before:opacity-100
      `}
      data-tooltip={isDark ? 'Light Mode' : 'Dark Mode'}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div 
        className={`
          flex items-center justify-center
          transition-transform
          duration-500
          ${isDark ? 'rotate-180' : 'rotate-0'}
        `}
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;