import React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg',
    ghost: 'hover:bg-white/10 text-gray-300',
    outline: 'border border-purple-500/50 text-purple-400 hover:bg-purple-500/10',
    destructive: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  const sizes = {
    default: 'px-4 py-2 rounded-lg text-sm',
    sm: 'px-3 py-1.5 rounded-md text-xs',
    lg: 'px-6 py-3 rounded-xl text-base',
    icon: 'p-2 rounded-lg',
  };
  
  return (
    <button
      className={cn(
        'font-medium transition-all duration-200 flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export { Button };