"use client";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "relative inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40",
    secondary:
      "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700",
    outline:
      "bg-transparent text-white border-2 border-purple-500 hover:bg-purple-500/10",
    ghost: "bg-transparent text-white hover:bg-white/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={combinedClassName}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={combinedClassName}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const GlowingButton = ({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) => {
  const content = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
        className
      )}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#d648ff_0%,#00d1b7_50%,#d648ff_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        {children}
      </span>
    </motion.span>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
};

export const ShimmerButton = ({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) => {
  const content = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-slate-800 px-6 py-3 font-medium text-white transition-all duration-300 ease-out hover:bg-slate-700",
        className
      )}
    >
      <span className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
        <span className="relative h-full w-10 bg-white/20" />
      </span>
      {children}
    </motion.span>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
};

export default Button;
