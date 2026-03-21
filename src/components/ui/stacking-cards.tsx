"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface StackingCardsProps {
  children: ReactNode;
  className?: string;
}

export function StackingCardItem({
  children,
  className,
  index = 0,
  progress = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  progress?: number;
}) {
  const scale = 1 - progress * 0.04;
  const brightness = 1 - progress * 0.3;

  return (
    <div
      className={cn("sticky mx-auto w-full max-w-5xl px-4 md:px-8", className)}
      style={{
        top: `calc(4rem + ${index * 18}px)`,
        zIndex: index + 1,
        transform: `scale(${scale})`,
        filter: `brightness(${brightness})`,
        transformOrigin: "top center",
        transition: "transform 0.12s ease-out, filter 0.12s ease-out",
        willChange: "transform, filter",
        marginBottom: 24,
      }}
    >
      {children}
    </div>
  );
}

export function StackingCards({ children, className }: StackingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progresses, setProgresses] = useState<number[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;

    const update = () => {
      const cards = container.querySelectorAll<HTMLElement>("[data-stack-card]");
      const newProgresses: number[] = [];

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const stickyTop = parseFloat(card.style.top) || 64;
        // How far the card has been pushed past its sticky point by the next card.
        const offset = stickyTop - rect.top;
        const progress = Math.max(0, Math.min(1, offset / 300));
        newProgresses.push(progress);
      });

      setProgresses(newProgresses);
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Clone children to inject index + progress props
  const items = Array.isArray(children) ? children : [children];

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {items.map((child, i) => {
        if (!child) return null;

        const progress = progresses[i] ?? 0;
        const scale = 1 - progress * 0.04;
        const brightness = 1 - progress * 0.3;

        return (
          <div
            key={i}
            data-stack-card
            className="sticky mx-auto w-full max-w-5xl px-4 md:px-8"
            style={{
              top: `calc(4rem + ${i * 18}px)`,
              zIndex: i + 1,
              transform: `scale(${scale})`,
              filter: `brightness(${brightness})`,
              transformOrigin: "top center",
              transition: "transform 0.12s ease-out, filter 0.12s ease-out",
              willChange: "transform, filter",
              marginBottom: 24,
            }}
          >
            {child}
          </div>
        );
      })}
      {/* Spacer so the last card has room to fully enter */}
      <div style={{ height: "30vh" }} />
    </div>
  );
}

export default StackingCards;
