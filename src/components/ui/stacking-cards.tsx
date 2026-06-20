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
        top: `calc(310px + ${index * 18}px)`,
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

      cards.forEach((_, index) => {
        // If this is the last card, it doesn't have a card stacking on top of it, so progress is 0.
        if (index === cards.length - 1) {
          newProgresses.push(0);
          return;
        }

        const nextCard = cards[index + 1];
        if (!nextCard) {
          newProgresses.push(0);
          return;
        }

        const nextRect = nextCard.getBoundingClientRect();
        // The next card's target sticky top position in the viewport
        const nextStickyTop = 310 + ((index + 1) * 18);
        
        // Transition starts when the next card is 200px below its sticky position,
        // and finishes when the next card reaches its sticky position.
        const startOffset = nextStickyTop + 200;
        const distanceTraveled = startOffset - nextRect.top;
        const progress = Math.max(0, Math.min(1, distanceTraveled / 200));
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
            data-index={i}
            className="sticky mx-auto w-full max-w-5xl px-4 md:px-8"
            style={{
              top: `calc(310px + ${i * 18}px)`,
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
      {/* Spacer so the last card has room to fully enter and center */}
      <div style={{ height: "60vh" }} />
    </div>
  );
}

export default StackingCards;
