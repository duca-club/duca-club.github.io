"use client";
import { motion } from "framer-motion";
import { FlipWords } from "@ui/flip-words";
import { Button } from "@ui/button";
import { SpotlightNew } from "@ui/spotlight";

export const AboutHeroSection = () => {
  const words = ["Inspiration", "Innovation", "Inclusivity", "Collaboration", "Development", "Leadership"];

  return (
    <section
      id="about-hero"
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden"
      style={{ background: "var(--theme-bg)" }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-cyan-900/20 via-transparent to-transparent" />
      <SpotlightNew className="-top-40 right-0 md:-top-20 md:right-60" fill="#00d1b7" />

      {/* Grid Pattern */}
      <div className="bg-grid-white/[0.02] absolute inset-0 bg-size-[50px_50px]" />

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
            About <span className="bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">DUCA</span>
          </h1>

          <div className="mb-8 flex flex-wrap items-center justify-center text-2xl text-gray-300 md:text-4xl">
            <span>We believe in</span>
            <FlipWords words={words} className="font-bold text-cyan-400" duration={2500} />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mx-auto mb-12 max-w-3xl text-xl text-gray-400"
          >
            Your gateway to hands-on learning, professional connections, and a supportive cybersecurity community!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Button href="https://dusa.org.au/clubs/duca" variant="primary">
              Join DUCA via DUSA
            </Button>
            <Button href="#team" variant="outline">
              Meet the Team
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
