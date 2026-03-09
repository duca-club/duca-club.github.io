"use client";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface MarqueeItem {
  id: string;
  content: ReactNode;
}

export const Marquee3D = ({
  items,
  className,
  reverse = false,
  pauseOnHover = true,
  vertical = false,
}: {
  items: MarqueeItem[];
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
}) => {
  return (
    <div
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        vertical && "flex-col",
        className
      )}
    >
      {Array(2)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex shrink-0 justify-around [gap:var(--gap)]",
              vertical && "flex-col animate-marquee-vertical",
              !vertical && "animate-marquee",
              reverse && "[animation-direction:reverse]",
              pauseOnHover && "group-hover:[animation-play-state:paused]"
            )}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="relative flex-shrink-0"
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  whileHover={{
                    rotateY: 10,
                    rotateX: -10,
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.3 }}
                  className="transform-gpu"
                >
                  {item.content}
                </motion.div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export const ProjectMarquee = ({
  projects,
  className,
}: {
  projects: {
    id: string;
    title: string;
    description: string;
    image: string;
    tags: string[];
  }[];
  className?: string;
}) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Marquee3D
        items={projects.map((project) => ({
          id: project.id,
          content: (
            <div className="w-80 h-48 rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/50 to-black border border-purple-500/20 p-4">
              <div className="relative h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg">{project.title}</h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ),
        }))}
      />
    </div>
  );
};

export default Marquee3D;
