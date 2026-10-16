import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'subtle';
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', id, ...props }, ref) => {
    return (
      <button
        id={id}
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
          // Variants
          variant === 'default' &&
            'bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-xs active:scale-[0.98]',
          variant === 'outline' &&
            'border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 active:scale-[0.98]',
          variant === 'ghost' &&
            'bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50',
          variant === 'secondary' &&
            'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
          variant === 'subtle' &&
            'bg-zinc-100/70 text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800/70 dark:text-zinc-300 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50',
          // Sizes
          size === 'sm' && 'h-8 px-3 text-xs rounded-md gap-1.5',
          size === 'default' && 'h-10 px-4 py-2 text-sm rounded-lg gap-2',
          size === 'lg' && 'h-11 px-6 text-base rounded-lg gap-2.5',
          size === 'icon' && 'h-9 w-9 p-0 rounded-lg',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
