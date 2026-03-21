"use client";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { useMouseGlow } from "@/utils/useMouseGlow";
import type { ReactNode } from "react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  href,
}: {
  className?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
  href?: string;
}) => {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href ? { href } : {};
  const { background, handlers } = useMouseGlow(
    300,
    "rgba(99, 102, 241, 0.1)",
  );

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "row-span-1 rounded-xl group/bento relative overflow-hidden hover:shadow-xl transition duration-200 shadow-none p-4 border border-white/[0.08] justify-between flex flex-col space-y-4",
        href && "cursor-pointer",
        className
      )}
      {...handlers}
    >
      {/* Mouse-tracked spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
        style={{ background }}
      />
      <div className="relative z-[1]">{header}</div>
      <div className="relative z-[1] group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-sans font-bold text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-xs text-neutral-400">
          {description}
        </div>
      </div>
    </Wrapper>
  );
};

export default BentoGrid;
