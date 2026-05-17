// src/components/ui/Card.jsx
import React from 'react';

const Card = ({
  children,
  className = '',
  padding = true,
  variant = 'default',  // 'default' | 'elevated' | 'bordered' | 'ghost' | 'glass'
  header,
  footer,
  hoverable = false,
  ...props
}) => {
  const variantClasses = {
    default: `
      bg-white dark:bg-gray-900/50
      dark:border border-zinc-200 dark:border-zinc-800
      shadow-sm
    `,
    elevated: `
      bg-white dark:bg-gray-900/50
      dark:border border-zinc-100 dark:border-zinc-800
      shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]
    `,
    bordered: `
      bg-transparent
      dark:border-2 border-zinc-200 dark:border-zinc-700
    `,
    ghost: `
      bg-zinc-50 dark:bg-zinc-800/50
      dark:border border-transparent
    `,
    glass: `
      bg-white/70 dark:bg-gray-900/50
      backdrop-blur-xl
      dark:border border-white/50 dark:border-zinc-700/50
      shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
    `,
  };

  const hoverClasses = hoverable
    ? 'hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_28px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 cursor-pointer'
    : '';

  return (
    <div
      className={`
        rounded-2xl
        transition-all duration-200
        ${variantClasses[variant] || variantClasses.default}
        ${hoverClasses}
        ${className}
      `}
      {...props}
    >
      {header && (
        <div className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          {header}
        </div>
      )}

      <div className={padding ? (header || footer ? 'p-6' : 'p-6') : ''}>
        {children}
      </div>

      {footer && (
        <div className="px-6 pb-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;