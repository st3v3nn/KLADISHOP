
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "font-bold border-4 border-black transition-all neo-shadow active:neo-shadow-active active:translate-x-[6px] active:translate-y-[6px] flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#A3FF00] text-black", // Lime
    secondary: "bg-[#FF007F] text-white", // Pink
    accent: "bg-[#7B2CBF] text-white", // Violet
    danger: "bg-red-500 text-white"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-xl"
  };

  const width = fullWidth ? "w-full" : "w-fit";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
