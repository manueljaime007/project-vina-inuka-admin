import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { FieldShell } from "./Input";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, hint, error, required, children, ...props }, ref) => {
    const select = (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-11 w-full appearance-none rounded-xl border border-line bg-surface px-4 pr-10 text-[14px] text-ink",
            "transition-colors focus-ring focus-visible:border-brand-navy",
            error && "border-danger",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
      </div>
    );

    if (!label && !hint && !error) return select;

    return (
      <FieldShell label={label} hint={hint} error={error} required={required}>
        {select}
      </FieldShell>
    );
  },
);
Select.displayName = "Select";
