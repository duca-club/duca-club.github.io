"use client";

import { motion } from "framer-motion";
import { StackingCards } from "@ui/stacking-cards";
import { SectionHeading } from "@ui/section-heading";
import { useMouseGlow } from "@/utils/useMouseGlow";

const whatWeDoCards = [
  {
    title: "Cybersecurity Workshops",
    description:
      "Get hands-on with ethical hacking, network defence, digital forensics, and malware analysis. Our workshops run every trimester and are built for every skill level — whether you have never touched a terminal or you are prepping for OSCP.",
    icon: "🔐",
    color: "#d648ff",
    bgColor: "#1e1033",
  },
  {
    title: "CTF Competitions",
    description:
      "Sharpen your problem-solving in Capture-the-Flag events. Our CTF team trains weekly, competes nationally and internationally, and welcomes new players who want to learn by doing. No experience required — just curiosity.",
    icon: "🚩",
    color: "#ef4444",
    bgColor: "#2d1216",
  },
  {
    title: "Industry Connections",
    description:
      "Meet cybersecurity professionals through networking nights, guest lectures, and career panels. Get resume feedback, discover internship pipelines, and build relationships that last well beyond university.",
    icon: "🤝",
    color: "#06b6d4",
    bgColor: "#0c2a32",
  },
  {
    title: "Community Building",
    description:
      "Join 900+ students in our Discord who share knowledge, collaborate on side-projects, and support each other through assignments, certifications, and job applications. DUCA is your cybersecurity home at Deakin.",
    icon: "👥",
    color: "#22c55e",
    bgColor: "#0d2818",
  },
  {
    title: "Development Projects",
    description:
      "Ship real software with our development team. From internal club tools to open-source platforms, you will gain practical coding experience, learn Git workflows, and build portfolio pieces that actually matter.",
    icon: "💻",
    color: "#f97316",
    bgColor: "#2d1a0a",
  },
  {
    title: "Learning Resources",
    description:
      "Access curated study guides, certification prep materials, and hands-on labs. Whether you are chasing CompTIA Security+, diving into cloud security, or exploring red-teaming — we have resources for every stage of your journey.",
    icon: "📚",
    color: "#8b5cf6",
    bgColor: "#1a1433",
  },
];

const StackingCardContent = ({
  card,
  index,
}: {
  card: (typeof whatWeDoCards)[number];
  index: number;
}) => {
  const { background, handlers } = useMouseGlow(
    400,
    `${card.color}18`,
  );

  return (
    <div
      className="group/stack relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
      style={{
        backgroundColor: card.bgColor,
        padding: "clamp(32px, 5vw, 56px)",
        minHeight: 340,
      }}
      {...handlers}
    >
      {/* Mouse-tracked accent glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/stack:opacity-100"
        style={{ background }}
      />

      {/* Large background number */}
      <div
        className="absolute left-5 top-1/2 -translate-y-1/2 select-none pointer-events-none font-extrabold"
        style={{
          fontSize: "clamp(120px, 18vw, 200px)",
          lineHeight: 1,
          color: "white",
          opacity: 0.06,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Icon + label */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${card.color}25` }}
        >
          {card.icon}
        </div>
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: card.color, opacity: 0.7 }}
        >
          {card.title}
        </span>
      </div>

      {/* Title */}
      <h3
        className="relative z-10 mb-4 font-bold"
        style={{
          color: card.color,
          fontSize: "clamp(22px, 3.5vw, 34px)",
          lineHeight: 1.15,
          maxWidth: "85%",
        }}
      >
        {card.title}
      </h3>

      {/* Description */}
      <p
        className="relative z-10 text-white/70 leading-relaxed"
        style={{
          fontSize: "clamp(14px, 1.8vw, 16px)",
          maxWidth: "80%",
        }}
      >
        {card.description}
      </p>
    </div>
  );
};

export const WhatWeDoStackingSection = () => {
  return (
    <section className="section-themed-alt">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <SectionHeading
          title="What We Do"
          subtitle="Hands-on learning and community support for future cybersecurity professionals"
        />
      </div>

      <StackingCards>
        {whatWeDoCards.map((card, i) => (
          <StackingCardContent key={card.title} card={card} index={i} />
        ))}
      </StackingCards>

      <div className="container mx-auto px-4 pb-12 pt-8">
        <div className="text-center">
          <p className="theme-text-secondary mb-6 text-lg">
            Ready to start your cybersecurity journey?
          </p>
          <a
            href="/join/"
            className="inline-flex items-center justify-center rounded-full bg-purple-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-purple-700"
          >
            Join Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoStackingSection;
