"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, indeterminate, ...props }, ref) => {
    return (
      <span className="relative inline-flex size-4.5 shrink-0 items-center justify-center">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          className="peer absolute inset-0 size-full cursor-pointer appearance-none rounded-md border border-line bg-surface transition-colors checked:border-brand-navy checked:bg-brand-navy focus-ring"
          {...props}
        />
        {(checked || indeterminate) && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white">
            {indeterminate ? (
              <Minus className="size-3" strokeWidth={3} />
            ) : (
              <Check className="size-3" strokeWidth={3} />
            )}
          </span>
        )}
      </span>
    );
  },
);
Checkbox.displayName = "Checkbox";
