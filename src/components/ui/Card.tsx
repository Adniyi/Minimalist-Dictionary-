import React from 'react';
import { cn } from '../../lib/utils';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  id,
  children,
  ...props
}) => {
  return (
    <div
      id={id}
      className={cn(
        'rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-5 md:p-6 text-zinc-950 dark:text-zinc-50 shadow-xs transition-shadow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  id,
  children,
  ...props
}) => {
  return (
    <div id={id} className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  id,
  children,
  ...props
}) => {
  return (
    <h3
      id={id}
      className={cn('text-lg font-semibold leading-none tracking-tight text-zinc-900 dark:text-zinc-100', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  id,
  children,
  ...props
}) => {
  return (
    <div id={id} className={cn('pt-0', className)} {...props}>
      {children}
    </div>
  );
};
