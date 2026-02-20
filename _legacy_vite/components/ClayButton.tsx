import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ClayButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'accent' | 'danger';
    isLoading?: boolean;
}

export function ClayButton({
    children,
    className,
    variant = 'primary',
    isLoading = false,
    disabled,
    ...props
}: ClayButtonProps) {

    const variantClasses = {
        primary: 'btn-cinematic btn-cinematic-primary',
        secondary: 'btn-cinematic btn-cinematic-secondary',
        accent: 'bg-[#DB2777] hover:bg-[#BE185D] shadow-[0_0_20px_rgba(219,39,119,0.4)]',
        danger: 'bg-red-600 hover:bg-red-700'
    };

    return (
        <button
            className={twMerge(
                "relative flex items-center justify-center font-bold font-mono tracking-wider uppercase text-white overflow-hidden transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95 h-12 px-8 rounded-full",
                variantClasses[variant],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}

            <span className={clsx(
                "relative z-10 flex items-center gap-2 transition-transform",
                !isLoading && "group-hover:translate-x-1"
            )}>
                {children}
            </span>

            {/* Hover Glow */}
            <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
    );
}
