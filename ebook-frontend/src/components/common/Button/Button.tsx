import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    fullWidth?: boolean;
}

const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 border-transparent shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-transparent',
    outline: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 border-transparent shadow-sm',
    link: 'text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline border-transparent p-0 h-auto',
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', isLoading = false, fullWidth = false, children, disabled, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border';

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
