"use client";
import type { ReactNode, MouseEvent } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const splitClasses = (classes?: string) => {
  if (!classes) return { outer: "", inner: "" };
  const outerKeywords = [
    "col-span", "row-span", "col-start", "col-end", "row-start", "row-end",
    "w-", "h-", "min-h", "max-h", "min-w", "max-w",
    "absolute", "relative", "fixed", "sticky", "z-",
    "top-", "bottom-", "left-", "right-", "inset-",
    "m-", "mx-", "my-", "mt-", "mb-", "ml-", "mr-",
    "flex", "grid", "order-", "self-", "grow", "shrink"
  ];
  
  const outerList: string[] = [];
  const innerList: string[] = [];
  
  classes.split(/\s+/).forEach((cls) => {
    const baseClass = cls.includes(":") ? cls.split(":").pop() : cls;
    if (baseClass && outerKeywords.some(keyword => baseClass.startsWith(keyword))) {
      outerList.push(cls);
    } else {
      innerList.push(cls);
    }
  });
  
  return {
    outer: outerList.join(" "),
    inner: innerList.join(" ")
  };
};

const hasBgClass = (classes: string) => {
  return classes.split(/\s+/).some(cls => {
    const baseClass = cls.includes(":") ? cls.split(":").pop() : cls;
    return baseClass && baseClass.startsWith("bg-");
  });
};

export const WobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: ReactNode;
  containerClassName?: string;
  className?: string;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (clientY - (rect.top + rect.height / 2)) / rect.height;
    setMousePosition({ x, y });
  };

  const { outer: outerClasses, inner: innerClasses } = splitClasses(containerClassName);

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      className={cn(
        "mx-auto w-full relative",
        outerClasses
      )}
      style={{
        perspective: "1000px",
      }}
    >
      <motion.div
        className={cn(
          "relative h-full w-full rounded-2xl overflow-hidden",
          hasBgClass(innerClasses) ? "" : "bg-indigo-800",
          innerClasses
        )}
        style={{
          transform: isHovering
            ? `rotateY(${mousePosition.x * 8}deg) rotateX(${-mousePosition.y * 8}deg) scale3d(1.02, 1.02, 1)`
            : "rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)",
          transition: "transform 0.15s ease-out",
          boxShadow:
            "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))] z-0" />
        <div className={cn("h-full px-4 py-20 sm:px-10 relative z-10", className)}>
          <Noise />
          <div className="relative z-20">{children}</div>
        </div>
      </motion.div>
    </section>
  );
};

const Noise = () => (
  <div
    className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)] pointer-events-none"
    style={{
      backgroundImage: "url(/noise.webp)",
      backgroundSize: "30%",
    }}
  ></div>
);

export default WobbleCard;
