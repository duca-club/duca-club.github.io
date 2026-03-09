"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface Card {
  id: number;
  title: string;
  category: string;
  content: ReactNode;
  thumbnail: string;
}

export const AppleCardsCarousel = ({
  items,
  className,
}: {
  items: Card[];
  className?: string;
}) => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn("relative w-full", className)}>
      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-4 pb-6 px-4 snap-x snap-mandatory scrollbar-hide"
      >
        {items.map((item) => (
          <Card
            key={item.id}
            card={item}
            isActive={activeCard === item.id}
            onActivate={() => setActiveCard(activeCard === item.id ? null : item.id)}
          />
        ))}
      </div>
    </div>
  );
};

const Card = ({
  card,
  isActive,
  onActivate,
}: {
  card: Card;
  isActive: boolean;
  onActivate: () => void;
}) => {
  return (
    <motion.div
      layoutId={`card-${card.id}`}
      onClick={onActivate}
      className={cn(
        "relative flex-shrink-0 cursor-pointer snap-center rounded-3xl overflow-hidden",
        isActive ? "w-full max-w-4xl h-[500px]" : "w-80 h-96"
      )}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      <motion.img
        layoutId={`image-${card.id}`}
        src={card.thumbnail}
        alt={card.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <motion.div
        layoutId={`content-${card.id}`}
        className="absolute bottom-0 left-0 right-0 p-6"
      >
        <motion.p
          layoutId={`category-${card.id}`}
          className="text-sm text-purple-400 font-medium mb-2"
        >
          {card.category}
        </motion.p>
        <motion.h3
          layoutId={`title-${card.id}`}
          className="text-2xl font-bold text-white"
        >
          {card.title}
        </motion.h3>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 text-gray-300"
          >
            {card.content}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export const HoverCard3D = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700",
        className
      )}
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="p-6"
      >
        {children}
      </div>
    </motion.div>
  );
};

export default AppleCardsCarousel;
