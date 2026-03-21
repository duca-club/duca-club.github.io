"use client";
import { useMotionValue, useMotionTemplate } from "framer-motion";
import { useCallback, useState } from "react";
import type { MouseEvent } from "react";

/**
 * Shared hook for mouse-tracked radial glow effects.
 * Returns Framer Motion values so the glow overlay bypasses React re-renders
 * on every mousemove — the gradient updates via the motion runtime instead.
 */
export function useMouseGlow(radius = 350, color = "rgba(168, 85, 247, 0.15)") {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY],
  );

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 80%)`;

  return {
    mouseX,
    mouseY,
    isHovering,
    background,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: () => setIsHovering(true),
      onMouseLeave: () => setIsHovering(false),
    },
  } as const;
}
