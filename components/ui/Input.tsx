import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-malzz-textDark">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-malzz-textLight">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-xl border bg-white/80 backdrop-blur-sm px-3.5 py-2.5 text-sm text-malzz-textDark placeholder:text-malzz-textLight transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-malzz-blue/30 focus:border-malzz-blue",
              error
                ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                : "border-gray-200 hover:border-gray-300",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-malzz-textLight">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-malzz-textLight">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
