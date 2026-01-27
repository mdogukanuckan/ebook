import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, helperText, startIcon, endIcon, id, ...props }, ref) => {
        const inputId = id || props.name || Math.random().toString(36).substr(2, 9);

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {startIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {startIcon}
                        </div>
                    )}
                    <input
                        id={inputId}
                        ref={ref}
                        className={`
              block w-full rounded-lg border-gray-300 shadow-sm
              focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
              disabled:bg-gray-50 disabled:text-gray-500
              ${startIcon ? 'pl-10' : ''}
              ${endIcon ? 'pr-10' : ''}
              ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}
              ${className}
            `}
                        {...props}
                    />
                    {endIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                            {endIcon}
                        </div>
                    )}
                </div>
                {error ? (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                ) : helperText ? (
                    <p className="mt-1 text-sm text-gray-500">{helperText}</p>
                ) : null}
            </div>
        );
    }
);

Input.displayName = 'Input';
