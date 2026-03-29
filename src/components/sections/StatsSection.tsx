"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { DEFAULT_DISCORD_MEMBER_COUNT } from "@/utils/discordMembers";
import { useMouseGlow } from "@/utils/useMouseGlow";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  sublabel: string;
  useShortAnimation?: boolean;
}

const AnimatedCounter = ({
  value,
  suffix = "",
  duration = 2,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });

    const controls = animate(count, value, {
      duration,
      ease: "easeOut",
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [count, value, rounded, duration]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
};

const StatCard = ({ value, suffix, label, sublabel, useShortAnimation = false }: StatProps) => {
  const [isInView, setIsInView] = useState(false);
  const { background, handlers } = useMouseGlow(250, "rgba(168, 85, 247, 0.12)");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: useShortAnimation ? 0.25 : 0.45 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsInView(true)}
      className="group/stat relative overflow-hidden rounded-2xl border border-slate-700/50 bg-linear-to-b from-slate-800/50 to-slate-900/50 p-8 text-center transition-colors hover:border-purple-500/50"
      {...handlers}
    >
      {/* Mouse-tracked radial glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/stat:opacity-100"
        style={{ background }}
      />
      <div className="relative z-[1] mb-2 text-5xl font-bold text-white md:text-6xl">
        {isInView ? (
          <AnimatedCounter value={value} suffix={suffix} duration={useShortAnimation ? 0.5 : 2} />
        ) : (
          `0${suffix}`
        )}
      </div>
      <div className="relative z-[1] text-xl font-medium text-purple-400">{label}</div>
      <div className="relative z-[1] mt-1 text-sm text-gray-300">{sublabel}</div>
    </motion.div>
  );
};

export const StatsSection = ({ memberCount = DEFAULT_DISCORD_MEMBER_COUNT }: { memberCount?: number }) => {
  const [shortAnimations, setShortAnimations] = useState(false);

  useEffect(() => {
    const syncOptions = () => {
      setShortAnimations(document.documentElement.getAttribute("data-a11y-duca42") === "true");
    };

    syncOptions();
    window.addEventListener("duca:accessibility-options-change", syncOptions);
    document.addEventListener("astro:page-load", syncOptions);

    return () => {
      window.removeEventListener("duca:accessibility-options-change", syncOptions);
      document.removeEventListener("astro:page-load", syncOptions);
    };
  }, []);

  return (
    <section className="section-themed data-stream-bg relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-purple-900/10 to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: shortAnimations ? 0.3 : 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center text-3xl font-bold text-white md:text-4xl"
        >
          DUCA by the{" "}
          <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">numbers</span>
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            value={memberCount}
            suffix="+"
            label="Members"
            sublabel="Active community"
            useShortAnimation={shortAnimations}
          />
          <StatCard value={50} suffix="+" label="Events" sublabel="This year" useShortAnimation={shortAnimations} />
          <StatCard
            value={20}
            suffix="+"
            label="Workshops"
            sublabel="Hands-on learning"
            useShortAnimation={shortAnimations}
          />
          <StatCard value={100} suffix="%" label="Free" sublabel="Always welcome" useShortAnimation={shortAnimations} />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
