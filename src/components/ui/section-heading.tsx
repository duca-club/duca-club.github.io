"use client";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

export const SectionHeading = ({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
  align = "center",
}: {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  align?: "left" | "center" | "right";
}) => {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("mb-12", alignmentClasses[align], className)}
    >
      <h2
        className={cn(
          "a11y-gradient-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl lg:text-5xl",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-4 max-w-2xl text-lg text-gray-400", align === "center" && "mx-auto", subtitleClassName)}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export const GradientHeading = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <h2
      className={cn(
        "a11y-gradient-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl lg:text-5xl",
        className,
      )}
    >
      {children}
    </h2>
  );
};

export default SectionHeading;
