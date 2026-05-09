import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error" | "purple" | "peach";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-malzz-blueLight text-malzz-blue border-malzz-blue/20",
  success: "bg-green-50 text-green-600 border-green-200",
  warning: "bg-amber-50 text-amber-600 border-amber-200",
  error: "bg-red-50 text-red-500 border-red-200",
  purple: "bg-malzz-lavender text-malzz-purple border-malzz-purple/20",
  peach: "bg-malzz-peachLight text-orange-500 border-orange-200",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
