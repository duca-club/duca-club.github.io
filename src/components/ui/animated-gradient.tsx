"use client";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

export const AnimatedGradientBackground = ({
  children,
  className,
  containerClassName,
  gradientColors = ["#d648ff", "#00d1b7", "#7c3aed", "#06b6d4"],
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  gradientColors?: string[];
}) => {
  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-slate-950",
        containerClassName
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -inset-[100%] opacity-50"
          animate={{
            background: [
              `radial-gradient(circle at 20% 50%, ${gradientColors[0]} 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 50%, ${gradientColors[1]} 0%, transparent 50%)`,
              `radial-gradient(circle at 50% 20%, ${gradientColors[2]} 0%, transparent 50%)`,
              `radial-gradient(circle at 50% 80%, ${gradientColors[3]} 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 50%, ${gradientColors[0]} 0%, transparent 50%)`,
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};

export const GlowingOrb = ({
  className,
  color = "#d648ff",
  size = 400,
}: {
  className?: string;
  color?: string;
  size?: number;
}) => {
  return (
    <motion.div
      className={cn("absolute rounded-full blur-3xl opacity-30", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export default AnimatedGradientBackground;
