import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { type FieldError } from 'react-hook-form';



// We need a specific type for textarea props to avoid TS conflicts if we were strict, 
// but for simplicity extending InputHTMLAttributes and casting is common in simple hybrids,
// or we can separate. Here I'll effectively ignore the mismatch for the textarea specific attr logic or handle it simply.
// Actually, better to separate props or just use 'any' for the underlying element props if mixing.
// Let's refine:

type CombinedProps = InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: FieldError;
    textarea?: boolean;
};

export const ClayInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, CombinedProps>(
    ({ label, error, textarea, className, id, ...props }, ref) => {

        const baseClasses = clsx(
            "w-full px-6 bg-black/30 border border-white/10 text-white placeholder-white/20 rounded-2xl transition-all duration-300 focus:outline-none focus:border-[#7C3AED] focus:bg-black/50 focus:shadow-[0_0_15px_rgba(124,58,237,0.1)]",
            className
        );

        return (
            <div className="flex flex-col gap-2 w-full group">
                {label && (
                    <label
                        htmlFor={id}
                        className="ml-2 text-xs font-mono font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-[#7C3AED] transition-colors"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {textarea ? (
                        <textarea
                            id={id}
                            ref={ref as any}
                            rows={4}
                            className={clsx(baseClasses, "py-4 resize-none")}
                            {...props as TextareaHTMLAttributes<HTMLTextAreaElement>}
                        />
                    ) : (
                        <input
                            id={id}
                            ref={ref as any}
                            className={clsx(baseClasses, "h-14")}
                            {...props as InputHTMLAttributes<HTMLInputElement>}
                        />
                    )}
                </div>

                {error && (
                    <span className="ml-2 text-xs font-mono text-red-400">
                        {error.message || 'REQUIRED FIELD'}
                    </span>
                )}
            </div>
        );
    }
);

ClayInput.displayName = 'ClayInput';
