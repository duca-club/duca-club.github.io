"use client";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

export interface ExpandableCardItem {
  id: string;
  title: string;
  description: string;
  content: ReactNode;
  ctaText?: string;
  ctaLink?: string;
  thumbnail?: string;
}

export const ExpandableCard = ({ item, className }: { item: ExpandableCardItem; className?: string }) => {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 h-full w-full bg-black/80"
            onClick={() => setActive(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-100 grid place-items-center">
            <motion.button
              key={`button-${item.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white"
              onClick={() => setActive(false)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${item.title}-${id}`}
              ref={ref}
              className="flex h-full w-full max-w-125 flex-col overflow-hidden bg-slate-900 sm:rounded-3xl md:h-fit md:max-h-[90%]"
            >
              {item.thumbnail && (
                <motion.div layoutId={`image-${item.title}-${id}`}>
                  <img src={item.thumbnail} alt={item.title} className="h-80 w-full object-cover" />
                </motion.div>
              )}
              <div className="p-6">
                <motion.h3 layoutId={`title-${item.title}-${id}`} className="text-xl font-bold text-white">
                  {item.title}
                </motion.h3>
                <motion.p layoutId={`description-${item.description}-${id}`} className="mt-2 text-gray-400">
                  {item.description}
                </motion.p>
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-gray-300"
                >
                  {item.content}
                  {item.ctaLink && (
                    <a
                      href={item.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block rounded-full bg-purple-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-purple-600"
                    >
                      {item.ctaText ?? "Learn More"}
                    </a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.div
        layoutId={`card-${item.title}-${id}`}
        onClick={() => setActive(true)}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-between rounded-xl border border-transparent p-4 transition-colors hover:border-slate-700 hover:bg-slate-800/50 md:flex-row",
          className,
        )}
      >
        <div className="flex flex-col gap-4 md:flex-row">
          {item.thumbnail && (
            <motion.div layoutId={`image-${item.title}-${id}`}>
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-40 w-40 rounded-lg object-cover object-center md:h-14 md:w-14"
              />
            </motion.div>
          )}
          <div>
            <motion.h3
              layoutId={`title-${item.title}-${id}`}
              className="text-center font-medium text-white md:text-left"
            >
              {item.title}
            </motion.h3>
            <motion.p
              layoutId={`description-${item.description}-${id}`}
              className="text-center text-gray-400 md:text-left"
            >
              {item.description}
            </motion.p>
          </div>
        </div>
        <motion.button
          layoutId={`button-${item.title}-${id}`}
          className="mt-4 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-purple-500 hover:text-white md:mt-0"
        >
          {item.ctaText ?? "View"}
        </motion.button>
      </motion.div>
    </>
  );
};

export const ExpandableCardList = ({ items, className }: { items: ExpandableCardItem[]; className?: string }) => {
  return (
    <ul className={cn("mx-auto w-full max-w-2xl gap-4", className)}>
      {items.map((item) => (
        <ExpandableCard key={item.id} item={item} />
      ))}
    </ul>
  );
};

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-black"
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

export default ExpandableCard;
