import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/helpers/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-150 focus-ring disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-navy text-white hover:bg-brand-navy-soft active:scale-[0.98] shadow-[0_2px_8px_-2px_rgba(20,24,43,0.35)]",
  secondary:
    "bg-surface text-ink border border-line hover:bg-surface-sunken active:scale-[0.98]",
  outline:
    "bg-transparent text-ink border border-line hover:bg-surface active:scale-[0.98]",
  ghost: "bg-transparent text-ink-soft hover:bg-surface-sunken hover:text-ink",
  danger:
    "bg-danger text-white hover:bg-danger-deep active:scale-[0.98] shadow-[0_2px_8px_-2px_rgba(224,88,79,0.45)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-[15px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
