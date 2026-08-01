import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) => {
  const baseStyle = `
    inline-flex items-center justify-center font-bold whitespace-nowrap
    transition-[transform,box-shadow,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sky-blue-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]
    disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] hover:-translate-y-0.5
    relative overflow-hidden cursor-pointer
  `;

  // We add a subtle shimmer effect on hover for the primary variant
  const variants = {
    primary: `
      bg-[image:var(--gradient-primary)] text-white
      shadow-[0_6px_20px_-4px_rgba(14,165,233,0.45)] hover:shadow-[0_12px_30px_-6px_rgba(14,165,233,0.55)]
      border border-transparent
      before:absolute before:top-0 before:-left-full before:w-full before:h-full
      before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent
      before:transition-all before:duration-700 hover:before:left-full
    `,
    secondary: `
      bg-[var(--muted-surface)] text-[var(--text-primary)]
      hover:bg-[var(--border)] border border-[var(--border)]
    `,
    outline: `
      bg-[var(--glass-bg)] text-[var(--text-primary)] border border-[var(--glass-border)]
      hover:bg-[var(--muted-surface)] hover:border-[var(--sky-blue-500)]/40
    `,
    ghost: `
      bg-transparent text-[var(--text-secondary)] hover:bg-[var(--muted-surface)] hover:text-[var(--text-primary)] border border-transparent
    `,
    danger: `
      bg-[var(--color-error)] text-white hover:opacity-90 border border-transparent shadow-[var(--shadow-sm)]
    `,
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-4 py-2 text-sm rounded-xl gap-2",
    lg: "px-6 py-2.5 text-base rounded-2xl gap-2",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Absolute overlay elements or static label */}
      <span className="relative z-10 flex items-center justify-center gap-inherit">
        {children}
      </span>
    </button>
  );
};
