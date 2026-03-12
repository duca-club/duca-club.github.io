"use client";
import { motion } from "framer-motion";
import { EncryptedText } from "@ui/encrypted-text";
// import { SpotlightNew } from "@ui/spotlight";
import { Button, GlowingButton } from "@ui/button";

export const HeroSection = () => {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-40"
      style={{ background: "var(--theme-bg)" }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-b from-purple-900/20 via-transparent to-transparent" />

      {/* Grid Pattern */}
      <div className="bg-grid-white/[0.02] absolute inset-0 bg-size-[50px_50px]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center"
        >
          {/* Encrypted DUCA Title */}
          <h1 className="mb-4 text-7xl font-bold md:text-9xl">DUCA</h1>

          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Deakin University Cybersecurity Association</h2>

          <div className="w-full text-balance xl:w-4/5">
            <EncryptedText
              text="Building a community of cybersecurity enthusiasts at Deakin University. Learn, share, and grow together with
            Australia's leading student cyber club."
              className="text-balance text-white"
              speed={1}
              revealDelay={0}
            />
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <GlowingButton href="/join">Join Us</GlowingButton>
            <Button variant="outline" href="#what-we-do">
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
