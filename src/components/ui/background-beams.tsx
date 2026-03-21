"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export const BackgroundBeams = ({
  className,
}: {
  className?: string;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    const element = ref.current;
    element?.addEventListener("mousemove", handleMouseMove);

    return () => {
      element?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,white,transparent)]",
        className
      )}
    >
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="beam-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(214, 72, 255, 0.8)" />
            <stop offset="100%" stopColor="rgba(214, 72, 255, 0)" />
          </radialGradient>
        </defs>
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={`beam-${i}`}
            x1={mousePosition.x}
            y1={mousePosition.y}
            x2={`${(i + 1) * 12.5}%`}
            y2="100%"
            stroke="url(#beam-gradient)"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        ))}
      </svg>
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(214, 72, 255, 0.15), transparent 40%)`,
        }}
      />
    </div>
  );
};

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const beams = [
    { initialX: 10, translateX: 10, duration: 7, repeatDelay: 3, delay: 2 },
    { initialX: 600, translateX: 600, duration: 3, repeatDelay: 3, delay: 4 },
    { initialX: 100, translateX: 100, duration: 7, repeatDelay: 7, className: "h-6" },
    { initialX: 400, translateX: 400, duration: 5, repeatDelay: 14, delay: 4 },
    { initialX: 800, translateX: 800, duration: 11, repeatDelay: 2, className: "h-20" },
    { initialX: 1000, translateX: 1000, duration: 4, repeatDelay: 2, className: "h-12" },
    { initialX: 1200, translateX: 1200, duration: 6, repeatDelay: 4, delay: 2, className: "h-6" },
  ];

  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden", className)}>
      {beams.map((beam, idx) => (
        <Beam key={`beam-${idx}`} {...beam} />
      ))}
      {children}
    </div>
  );
};

const Beam = ({
  className,
  delay,
  duration,
  initialX,
  translateX,
  repeatDelay,
}: {
  className?: string;
  delay?: number;
  duration?: number;
  initialX?: number;
  translateX?: number;
  repeatDelay?: number;
}) => {
  return (
    <motion.div
      initial={{
        translateY: "-200px",
        translateX: initialX,
      }}
      animate={{
        translateY: "1800px",
        translateX: translateX,
      }}
      transition={{
        duration: duration ?? 8,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        delay: delay ?? 0,
        repeatDelay: repeatDelay ?? 0,
      }}
      className={cn(
        "absolute left-0 top-0 w-px h-12 bg-gradient-to-b from-transparent via-purple-500 to-transparent",
        className
      )}
    />
  );
};

export default BackgroundBeams;
