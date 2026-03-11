"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  sublabel: string;
}

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });

    const controls = animate(count, value, {
      duration: 2,
      ease: "easeOut",
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [count, value, rounded]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
};

const StatCard = ({ value, suffix, label, sublabel }: StatProps) => {
  const [isInView, setIsInView] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsInView(true)}
      className="rounded-2xl border border-slate-700/50 bg-linear-to-b from-slate-800/50 to-slate-900/50 p-8 text-center transition-colors hover:border-purple-500/50"
    >
      <div className="mb-2 text-5xl font-bold text-white md:text-6xl">
        {isInView ? <AnimatedCounter value={value} suffix={suffix} /> : `0${suffix}`}
      </div>
      <div className="text-xl font-medium text-purple-400">{label}</div>
      <div className="mt-1 text-sm text-gray-300">{sublabel}</div>
    </motion.div>
  );
};

export const StatsSection = ({ memberCount = 750 }: { memberCount?: number }) => {
  return (
    <section className="section-themed data-stream-bg relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-purple-900/10 to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center text-3xl font-bold text-white md:text-4xl"
        >
          DUCA by the{" "}
          <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">numbers</span>
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard value={memberCount} suffix="+" label="Members" sublabel="Active community" />
          <StatCard value={50} suffix="+" label="Events" sublabel="This year" />
          <StatCard value={20} suffix="+" label="Workshops" sublabel="Hands-on learning" />
          <StatCard value={100} suffix="%" label="Free" sublabel="Always welcome" />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
