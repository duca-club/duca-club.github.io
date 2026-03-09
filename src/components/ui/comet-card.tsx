"use client";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

export const CometCard = ({
  children,
  className,
  containerClassName,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-px",
        containerClassName
      )}
    >
      <Comet />
      <div
        className={cn(
          "relative rounded-2xl bg-slate-900 p-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

const Comet = () => {
  return (
    <motion.div
      initial={{ top: 0, left: "-10%", opacity: 0 }}
      animate={{
        left: ["0%", "100%"],
        top: ["0%", "100%"],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "linear",
      }}
      className="absolute h-px w-[50px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"
      style={{
        boxShadow: "0 0 10px 2px rgba(168, 85, 247, 0.5)",
      }}
    />
  );
};

export const CometCardGrid = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon?: ReactNode;
    href?: string;
  }[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <CometCard key={idx}>
          <a
            href={item.href ?? "#"}
            className="block group"
          >
            {item.icon && (
              <div className="mb-4 text-purple-500">{item.icon}</div>
            )}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
              {item.title}
            </h3>
            <p className="text-gray-400 text-sm">{item.description}</p>
          </a>
        </CometCard>
      ))}
    </div>
  );
};

export default CometCard;
