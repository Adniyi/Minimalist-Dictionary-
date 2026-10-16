import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'muted';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  id,
  children,
  ...props
}) => {
  return (
    <div
      id={id}
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors whitespace-nowrap',
        variant === 'default' &&
          'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900',
        variant === 'secondary' &&
          'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60',
        variant === 'outline' &&
          'border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 bg-transparent',
        variant === 'success' &&
          'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        variant === 'warning' &&
          'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
        variant === 'muted' &&
          'bg-zinc-100 text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400 font-mono',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
