import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hoverable = false,
  onClick,
}: CardProps) {
  return (
    <div
      className={`
        bg-white border border-neutral-200 rounded-xl p-6
        ${hoverable ? 'hover:shadow-lg hover:border-neutral-300 hover:-translate-y-0.5 cursor-pointer' : 'shadow-sm'}
        transition-all duration-300
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
