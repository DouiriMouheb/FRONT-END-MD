import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className={`btn btn-ghost ${className}`} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      {theme === 'light' ? (
        <>
          <Moon className="w-5 h-5 text-subtle group-hover:text-text transition-colors" />
          <span className="ml-2 text-sm font-medium text-subtle hidden sm:inline">
            Dark
          </span>
        </>
      ) : (
        <>
          <Sun className="w-5 h-5 text-subtle group-hover:text-text transition-colors" />
          <span className="ml-2 text-sm font-medium text-subtle hidden sm:inline">
            Light
          </span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;