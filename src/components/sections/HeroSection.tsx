"use client";
import { motion } from "framer-motion";
import { EncryptedText } from "@ui/encrypted-text";
import { Button } from "@ui/button";
import { useMouseGlow } from "@/utils/useMouseGlow";
import { useEffect, useState } from "react";

export const HeroSection = () => {
  const [shortAnimations, setShortAnimations] = useState(false);
  const [improveReadability, setImproveReadability] = useState(false);

  useEffect(() => {
    const syncOptions = () => {
      setShortAnimations(document.documentElement.getAttribute("data-a11y-duca42") === "true");
      setImproveReadability(document.documentElement.getAttribute("data-a11y-duca43") === "true");
    };

    syncOptions();
    window.addEventListener("duca:accessibility-options-change", syncOptions);
    document.addEventListener("astro:page-load", syncOptions);

    return () => {
      window.removeEventListener("duca:accessibility-options-change", syncOptions);
      document.removeEventListener("astro:page-load", syncOptions);
    };
  }, []);

  const { background, isHovering, handlers } = useMouseGlow(600, "rgba(139, 92, 246, 0.12)");

  const introDuration = shortAnimations ? 0.45 : 0.8;
  const ctaDuration = shortAnimations ? 0.32 : 0.5;
  const ctaDelay = shortAnimations ? 1.05 : 2;

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-40"
      style={{ background: "var(--theme-bg)" }}
      {...handlers}
    >
      {/* Background Effects */}
      <div
        className={`a11y-hero-overlay absolute inset-0 bg-linear-to-b via-transparent to-transparent ${
          improveReadability ? "from-black/55" : "from-purple-900/20"
        }`}
      />

      {/* Grid Pattern */}
      <div className="bg-grid-white/[0.02] absolute inset-0 bg-size-[50px_50px]" />

      {improveReadability && <div className="pointer-events-none absolute inset-0 bg-black/25" />}

      {/* Mouse-reactive torch glow — illuminates the grid as the cursor moves */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-500"
        style={{ background, opacity: isHovering ? 1 : 0 }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: introDuration }}
          className="flex flex-col items-center justify-center text-center"
        >
          {/* Encrypted DUCA Title */}
          <h1
            className={`a11y-hero-title mb-4 text-7xl font-bold md:text-9xl ${
              improveReadability ? "text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.85)]" : ""
            }`}
          >
            DUCA
          </h1>

          <h2
            className={`a11y-hero-subtitle mb-4 text-3xl font-bold md:text-4xl ${
              improveReadability ? "text-slate-100 [text-shadow:0_2px_10px_rgba(0,0,0,0.8)]" : ""
            }`}
          >
            Deakin University Cybersecurity Association
          </h2>

          <div className="w-full text-balance xl:w-4/5">
            <EncryptedText
              text="Building a community of cybersecurity enthusiasts at Deakin University. Learn, share, and grow together with
            Australia's leading student cyber club."
              className={`a11y-hero-body text-balance ${improveReadability ? "text-slate-100 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]" : "text-white"}`}
              speed={1}
              revealDelay={0}
            />
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ctaDelay, duration: ctaDuration }}
            className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
          >
            {/*<GlowingButton href="/join">Join Us</GlowingButton>*/}
            <Button href="/join" variant="primary">
              Join Us
            </Button>

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
