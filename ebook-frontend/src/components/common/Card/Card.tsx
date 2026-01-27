import { HTMLAttributes, forwardRef } from 'react';

// Card Container
export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = '', ...props }, ref) => (
        <div
            ref={ref}
            className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}
            {...props}
        />
    )
);
Card.displayName = 'Card';

// Card Header
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = '', ...props }, ref) => (
        <div
            ref={ref}
            className={`px-6 py-4 border-b border-gray-100 ${className}`}
            {...props}
        />
    )
);
CardHeader.displayName = 'CardHeader';

// Card Title
export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className = '', ...props }, ref) => (
        <h3
            ref={ref}
            className={`text-lg font-semibold text-gray-900 leading-none tracking-tight ${className}`}
            {...props}
        />
    )
);
CardTitle.displayName = 'CardTitle';

// Card Description
export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className = '', ...props }, ref) => (
        <p
            ref={ref}
            className={`text-sm text-gray-500 mt-1.5 ${className}`}
            {...props}
        />
    )
);
CardDescription.displayName = 'CardDescription';

// Card Content
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = '', ...props }, ref) => (
        <div
            ref={ref}
            className={`p-6 ${className}`}
            {...props}
        />
    )
);
CardContent.displayName = 'CardContent';

// Card Footer
export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = '', ...props }, ref) => (
        <div
            ref={ref}
            className={`px-6 py-4 bg-gray-50 flex items-center ${className}`}
            {...props}
        />
    )
);
CardFooter.displayName = 'CardFooter';
