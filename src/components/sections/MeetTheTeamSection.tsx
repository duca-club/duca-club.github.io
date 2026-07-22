"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@ui/section-heading";
import { TeamGrid } from "@ui/team-card";
import { AuroraBackground } from "@ui/aurora-background";
import { executives, divisions } from "@/data/team";

export const MeetTheTeamSection = () => {
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const years = ["2025", "2026"];

  const currentExecutives = executives[selectedYear] || [];
  const currentDivisions = divisions[selectedYear] || [];

  return (
    <div className="w-full">
      {/* Hero Section with Aurora Background */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <AuroraBackground className="absolute inset-0 h-full!" showRadialGradient={false}>
          <div></div>
        </AuroraBackground>
        
        {/* Content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 pt-40 pb-28">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
              <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Meet The Team</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-300 md:text-2xl">
              We're a bunch of curious, passionate people building a welcoming space for everyone - come see what we get up
              to!
            </p>
          </div>
        </div>

        {/* Bottom Fade Overlay to blend the hero background into the content background */}
        <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-10" style={{ backgroundImage: "linear-gradient(to top, var(--theme-bg) 0%, rgba(0, 5, 26, 0.85) 30%, rgba(0, 5, 26, 0.3) 65%, transparent 100%)" }} />

        {/* Year Selector Tabs positioned inside the bottom of the Hero Section */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex justify-center">
          <div className="inline-flex items-center gap-1 bg-slate-950/60 border border-white/10 p-1.5 rounded-full shadow-2xl backdrop-blur-md">
            {years.map((year) => {
              const isActive = selectedYear === year;
              return (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`relative px-8 py-2.5 text-sm font-bold rounded-full transition-colors duration-200 outline-none cursor-pointer ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeYearIndicator"
                      className="absolute inset-0 bg-linear-to-r from-purple-600 to-indigo-600 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{year}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Team Lists with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedYear}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full"
        >
          {/* Executives Section */}
          <section className="section-themed relative overflow-hidden py-24">
            {/* Top Fade Overlay to blend the hero into the executives grid lines */}
            <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(to bottom, var(--theme-bg) 0%, rgba(0, 5, 26, 0.85) 30%, rgba(0, 5, 26, 0.3) 65%, transparent 100%)" }} />

            {/* Spotlight light beam effect for visual appeal */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />
            <div className="container mx-auto px-4 relative z-10">
              <SectionHeading
                title={`${selectedYear} Executives`}
                subtitle="The leadership team driving DUCA forward"
              />
              <TeamGrid members={currentExecutives} className="mt-12" />
            </div>
          </section>

          {/* Committee Divisions */}
          {currentDivisions.map((division, divIdx) => (
            <section
              key={division.name}
              className={`section-themed relative overflow-hidden py-20 ${
                divIdx % 2 === 0
                  ? "border-t border-purple-500/10"
                  : "border-t border-slate-700/30"
              }`}
            >
              {/* Subtle background light gradient */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-cyan-900/5 to-transparent" />
              
              <div className="container mx-auto px-4 relative z-10">
                <SectionHeading title={division.name} subtitle={division.description} />
                <TeamGrid members={division.members} className="mt-8" />
              </div>
            </section>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MeetTheTeamSection;
