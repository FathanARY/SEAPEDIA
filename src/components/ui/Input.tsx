import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-2.5 text-sm rounded-lg
          border border-neutral-300 bg-white text-neutral-900
          placeholder:text-neutral-400
          focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent
          disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed
          transition-all duration-200
          ${error ? 'border-red-400 focus:ring-red-300' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helperText && !error && <p className="text-xs text-neutral-400">{helperText}</p>}
    </div>
  );
}
