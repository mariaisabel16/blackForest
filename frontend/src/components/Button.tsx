import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: ReactNode;
  icon?: ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  children, 
  icon,
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2';
  
  const variants = {
    primary: 'bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50',
    secondary: 'bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 hover:from-violet-100 hover:to-purple-100',
    outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
