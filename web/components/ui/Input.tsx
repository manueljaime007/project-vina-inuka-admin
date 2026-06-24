import {
  InputHTMLAttributes,
  forwardRef,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/shared/helpers/utils";

interface FieldShellProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FieldShell({
  label,
  hint,
  error,
  required,
  children,
  className,
}: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-soft">
          {label} {required && <span className="text-brand-rose-deep">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className="text-xs text-ink-faint">{hint}</span>}
      {error && <span className="text-xs text-danger-deep">{error}</span>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, hint, error, leftIcon, required, id, ...props },
    ref,
  ) => {
    const input = (
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "h-11 w-full rounded-xl border border-line bg-surface px-4 text-[14px] text-ink placeholder:text-ink-faint",
            "transition-colors focus-ring focus-visible:border-brand-navy",
            leftIcon && "pl-10",
            error && "border-danger",
            className,
          )}
          {...props}
        />
      </div>
    );

    if (!label && !hint && !error) return input;

    return (
      <FieldShell label={label} hint={hint} error={error} required={required}>
        {input}
      </FieldShell>
    );
  },
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, required, ...props }, ref) => {
    const textarea = (
      <textarea
        ref={ref}
        className={cn(
          "min-h-27.5 w-full resize-none rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink placeholder:text-ink-faint",
          "transition-colors focus-ring focus-visible:border-brand-navy",
          error && "border-danger",
          className,
        )}
        {...props}
      />
    );

    if (!label && !hint && !error) return textarea;

    return (
      <FieldShell label={label} hint={hint} error={error} required={required}>
        {textarea}
      </FieldShell>
    );
  },
);
Textarea.displayName = "Textarea";
