"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface StackingCardsProps {
  children: ReactNode;
  footer?: ReactNode;
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

export function StackingCards({ children, footer, className }: StackingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [progresses, setProgresses] = useState<number[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;
    let scrollTrigger = 0;
    const cardTriggers: number[] = [];

    const calculateTriggers = () => {
      const cards = container.querySelectorAll<HTMLElement>("[data-stack-card]");
      const sentinel = sentinelRef.current;
      if (cards.length === 0 || !sentinel) return;

      // Temporarily store original inline positioning styles
      const originalStyles = Array.from(cards).map(card => ({
        position: card.style.position,
        top: card.style.top,
      }));

      // Set position to relative temporarily to read layout-natural coordinates
      cards.forEach(card => {
        card.style.position = "relative";
        card.style.top = "auto";
      });

      // Force a single document-wide layout read
      const naturalDocTops = Array.from(cards).map(card => {
        return card.getBoundingClientRect().top + window.scrollY;
      });

      // Restore original sticky positioning styles
      cards.forEach((card, i) => {
        card.style.position = originalStyles[i].position;
        card.style.top = originalStyles[i].top;
      });

      // Populate scroll offsets where each card sticks
      cardTriggers.length = 0;
      cards.forEach((_, index) => {
        const cardDocTop = naturalDocTops[index];
        const stickyTop = 310 + index * 18;
        cardTriggers.push(cardDocTop - stickyTop);
      });

      // Pre-calculate the scroll threshold when the last card reaches its destination
      const lastIndex = cards.length - 1;
      const lastCard = cards[lastIndex];
      if (lastCard) {
        const lastCardHeight = lastCard.getBoundingClientRect().height;
        const lastStickyTop = 310 + lastIndex * 18;
        const lastStickyBottom = lastStickyTop + lastCardHeight;
        const sentinelDocTop = sentinel.getBoundingClientRect().top + window.scrollY;
        scrollTrigger = sentinelDocTop - lastStickyBottom;
      }
    };

    const update = () => {
      const cards = container.querySelectorAll<HTMLElement>("[data-stack-card]");
      const header = document.querySelector<HTMLElement>("[data-sticky-header]");
      const newProgresses: number[] = [];

      const currentScroll = window.scrollY;
      const pushOffset = Math.max(0, currentScroll - scrollTrigger);

      if (header) {
        header.style.top = `${96 - pushOffset}px`;
      }

      cards.forEach((card, index) => {
        // Shift sticky offsets in unison during exit scroll
        card.style.top = `calc(310px + ${index * 18}px - ${pushOffset}px)`;

        // The top-most stacked card doesn't scale/dim
        if (index === cards.length - 1) {
          newProgresses.push(0);
          return;
        }

        // Scale and dim each card relative to the scroll progress of the card stacked directly on top of it
        const nextStickScroll = cardTriggers[index + 1] ?? 0;
        const progress = Math.max(0, Math.min(1, (currentScroll - (nextStickScroll - 200)) / 200));
        newProgresses.push(progress);
      });

      setProgresses(newProgresses);
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    const onResize = () => {
      calculateTriggers();
      update();
    };

    calculateTriggers();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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
      {/* Sentinel to track the natural scroll position of the last card */}
      <div ref={sentinelRef} className="h-0 w-0 opacity-0 pointer-events-none" />
      {/* Footer / CTA content rendered directly below the cards stack in the normal document flow */}
      {footer && (
        <div 
          data-stack-footer
          className="relative z-10 w-full"
          style={{
            marginTop: 40,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

export default StackingCards;
