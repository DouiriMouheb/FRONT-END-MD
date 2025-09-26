import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center justify-center p-2 rounded-lg border border-border 
        bg-background hover:bg-muted transition-all duration-200 
        shadow-sm hover:shadow-md group ${className}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="ml-2 text-sm font-medium text-muted-foreground group-hover:text-foreground hidden sm:inline">
            Dark
          </span>
        </>
      ) : (
        <>
          <Sun className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="ml-2 text-sm font-medium text-muted-foreground group-hover:text-foreground hidden sm:inline">
            Light
          </span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;