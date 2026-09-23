import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const SessionTimer = ({ expiresAt, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = new Date(expiresAt) - new Date();
      if (remaining <= 0) {
        clearInterval(interval);
        onEnd();
        setTimeLeft('Ended');
      } else {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onEnd]);

  return (
    <div className="flex items-center gap-1 text-xs text-gray-400">
      <Clock className="w-3 h-3" />
      <span>{timeLeft}</span>
    </div>
  );
};