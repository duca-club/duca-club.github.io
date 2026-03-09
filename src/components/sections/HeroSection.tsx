"use client";
import { motion } from "framer-motion";
import { TypewriterEffectSmooth } from "@ui/typewriter-effect";
import { EncryptedText } from "@ui/encrypted-text";
import { SpotlightNew } from "@ui/spotlight";
import { Button, GlowingButton } from "@ui/button";

export const HeroSection = () => {
  const words = [
    { text: "Deakin", className: "text-white" },
    { text: "University", className: "text-white" },
    { text: "Cybersecurity", className: "text-white" },
    { text: "Association", className: "text-purple-500" },
  ];

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ background: "var(--theme-bg)" }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-b from-purple-900/20 via-transparent to-transparent" />
      <SpotlightNew className="-top-40 left-0 md:-top-20 md:left-60" fill="#d648ff" />

      {/* Grid Pattern */}
      <div className="bg-grid-white/[0.02] absolute inset-0 bg-size-[50px_50px]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Encrypted DUCA Title */}
          <h1 className="mb-4 text-7xl font-bold md:text-9xl">
            <EncryptedText
              text="DUCA"
              className="bg-linear-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent"
              speed={40}
              revealDelay={300}
            />
          </h1>

          {/* Typewriter Subtitle */}
          <div className="mb-8 flex justify-center">
            <TypewriterEffectSmooth words={words} />
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="mx-auto mb-12 max-w-3xl text-xl text-gray-300 md:text-2xl"
          >
            Building a community of cybersecurity enthusiasts at Deakin University. Learn, share, and grow together with
            Australia's leading student cyber club.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <GlowingButton href="https://dusa.org.au/clubs/deakin-university-cybersecurity-association-burwood-duca">
              Join Now
            </GlowingButton>
            <Button variant="outline" href="#what-we-do">
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 transform"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-2 h-3 w-1 rounded-full bg-white/50"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
