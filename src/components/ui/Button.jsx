// src/components/ui/Button.jsx (simplified test version)
import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {

  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
  `;

  const variantClasses = {
    primary: `
      bg-blue-600 hover:bg-blue-700
      text-white
      focus:ring-blue-500/50
      dark:bg-blue-500 dark:hover:bg-blue-600
      dark:focus:ring-blue-400/50
    `,
    secondary: `
      bg-gray-200 hover:bg-gray-300
      text-gray-900
      focus:ring-gray-400/50
      dark:bg-gray-700 dark:hover:bg-gray-600
      dark:text-white
      dark:focus:ring-gray-500/50
    `,
    outline: `
      border-2 border-gray-300 
      bg-transparent hover:bg-gray-50
      text-gray-700 
      focus:ring-gray-400/50
      dark:border-gray-600
      dark:hover:bg-gray-800
      dark:text-gray-300
      dark:focus:ring-gray-500/50
    `,
    danger: `
      bg-red-600 hover:bg-red-700
      text-white
      focus:ring-red-500/50
      dark:bg-red-500 dark:hover:bg-red-600
      dark:focus:ring-red-400/50
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
      
    </button>
  );
};

export default Button;