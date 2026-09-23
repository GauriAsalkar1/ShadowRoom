import React from 'react';

export const TypingIndicator = ({ name }) => {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
      <span>{name} is typing...</span>
    </div>
  );
};