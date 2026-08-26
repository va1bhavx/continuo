import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    const inputId = id ?? `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="flex w-full max-w-lg flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium tracking-[-0.01em] text-text-secondary"
          >
            {label}
          </label>
        )}

        <div className="group relative">
          <input
            {...props}
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`
              peer
              h-12
              w-full
              rounded-md
              border
              bg-text-primary
              px-3.5
              text-[14px]
              font-medium
              tracking-[-0.01em]
              text-surface!
              shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
              outline-none

              border-border
              placeholder:text-text-surface!
              placeholder:font-normal

              transition-[border-color,background-color,box-shadow]
              duration-150
              ease-out

              hover:border-border-strong
              focus:border-accent-soft-border
              focus:shadow-[0_0_0_3px_var(--accent-soft)]

              disabled:cursor-not-allowed
              disabled:opacity-50

              ${
                error
                  ? `
                    border-danger
                    focus:border-danger
                    focus:shadow-[0_0_0_3px_var(--danger-soft)]
                  `
                  : ""
              }

              ${className}
            `}
          />

          {error && (
            <AlertCircle
              size={16}
              strokeWidth={1.8}
              className="
                pointer-events-none
                absolute
                right-3.5
                top-1/2
                -translate-y-1/2
                text-danger
              "
            />
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="flex items-center gap-1.5 text-xs text-danger"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
