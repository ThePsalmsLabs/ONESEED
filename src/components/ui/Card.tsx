'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'bg-white border border-gray-200',
  bordered: 'bg-white border-2 border-gray-300',
  elevated: 'bg-white shadow-lg border border-gray-100',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-lg
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mb-4 ${className}`} {...props} />
);

export const CardTitle = ({ className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className}`} {...props} />
);

export const CardDescription = ({ className = '', ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props} />
);

export const CardContent = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props} />
);

export const CardFooter = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`} {...props} />
);

