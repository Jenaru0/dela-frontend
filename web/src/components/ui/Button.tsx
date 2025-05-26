import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define las variantes del botón utilizando class-variance-authority
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-[#CC9F53] text-white shadow-lg hover:bg-[#B88D42] hover:shadow-xl active:scale-[0.98] border border-[#E6D5A8] focus:ring-[#CC9F53] focus:ring-2',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg active:scale-[0.98]',
        outline:
          'border-2 border-[#CC9F53] text-[#CC9F53] bg-white hover:bg-[#F5EFD7]/60 hover:text-[#3A3A3A] hover:shadow-lg active:scale-[0.98] focus:ring-[#CC9F53] focus:ring-2',
        secondary:
          'bg-[#F5EFD7] text-[#CC9F53] hover:bg-[#CC9F53]/10 border border-[#E6D5A8] hover:shadow-md active:scale-[0.98]',
        ghost:
          'bg-transparent hover:bg-[#F5EFD7]/60 text-[#3A3A3A] hover:text-[#CC9F53]',
        link: 'bg-transparent underline-offset-4 hover:underline text-[#CC9F53] hover:bg-transparent hover:text-[#B88D42]',
        success:
          'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg active:scale-[0.98]',
        warning:
          'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg active:scale-[0.98]',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-11 px-8 text-base',
        xl: 'h-12 px-10 text-lg rounded-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Define los props del componente Button
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

// Componente Button
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
