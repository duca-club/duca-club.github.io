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

export const ExpandableCard = ({
  item,
  className,
}: {
  item: ExpandableCardItem;
  className?: string;
}) => {
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
            className="fixed inset-0 bg-black/80 h-full w-full z-10"
            onClick={() => setActive(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${item.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex absolute top-4 right-4 items-center justify-center bg-white rounded-full h-8 w-8"
              onClick={() => setActive(false)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${item.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-slate-900 sm:rounded-3xl overflow-hidden"
            >
              {item.thumbnail && (
                <motion.div layoutId={`image-${item.title}-${id}`}>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-80 object-cover"
                  />
                </motion.div>
              )}
              <div className="p-6">
                <motion.h3
                  layoutId={`title-${item.title}-${id}`}
                  className="text-xl font-bold text-white"
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${item.description}-${id}`}
                  className="text-gray-400 mt-2"
                >
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
                      className="inline-block mt-4 px-4 py-2 text-sm rounded-full font-bold bg-purple-500 text-white hover:bg-purple-600 transition-colors"
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
          "p-4 flex flex-col md:flex-row justify-between items-center hover:bg-slate-800/50 rounded-xl cursor-pointer border border-transparent hover:border-slate-700 transition-colors",
          className
        )}
      >
        <div className="flex gap-4 flex-col md:flex-row">
          {item.thumbnail && (
            <motion.div layoutId={`image-${item.title}-${id}`}>
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-center"
              />
            </motion.div>
          )}
          <div>
            <motion.h3
              layoutId={`title-${item.title}-${id}`}
              className="font-medium text-white text-center md:text-left"
            >
              {item.title}
            </motion.h3>
            <motion.p
              layoutId={`description-${item.description}-${id}`}
              className="text-gray-400 text-center md:text-left"
            >
              {item.description}
            </motion.p>
          </div>
        </div>
        <motion.button
          layoutId={`button-${item.title}-${id}`}
          className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-purple-500 hover:text-white text-black mt-4 md:mt-0 transition-colors"
        >
          {item.ctaText ?? "View"}
        </motion.button>
      </motion.div>
    </>
  );
};

export const ExpandableCardList = ({
  items,
  className,
}: {
  items: ExpandableCardItem[];
  className?: string;
}) => {
  return (
    <ul className={cn("max-w-2xl mx-auto w-full gap-4", className)}>
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
