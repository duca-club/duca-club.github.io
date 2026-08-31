"use client";
import { motion } from "framer-motion";
import { EncryptedText } from "@ui/encrypted-text";
import { Button } from "@ui/button";
import { useMouseGlow } from "@/utils/useMouseGlow";
import { useEffect, useState } from "react";

// Neon Cyber/IT Icon component
const CyberIcon = ({
  type,
  className,
  style,
}: {
  type: "lock" | "shield" | "terminal" | "server";
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    viewBox="0 0 100 100"
    className={`pointer-events-none absolute z-0 select-none ${className || ""}`}
    style={style}
  >
    <defs>
      <linearGradient id="cyber-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#00d1b7" />
        <stop offset="100%" stopColor="#d648ff" />
      </linearGradient>
    </defs>
    {type === "lock" && (
      <>
        <path
          d="M30,45 L30,78 C30,80 32,82 34,82 L66,82 C68,82 70,80 70,78 L70,45 Z"
          fill="none"
          stroke="url(#cyber-grad)"
          strokeWidth="4"
        />
        <path d="M40,45 L40,30 C40,18 60,18 60,30 L60,45" fill="none" stroke="url(#cyber-grad)" strokeWidth="4" />
        <circle cx="50" cy="58" r="4.5" fill="url(#cyber-grad)" />
        <line x1="50" y1="62.5" x2="50" y2="71" stroke="url(#cyber-grad)" strokeWidth="3" strokeLinecap="round" />
      </>
    )}
    {type === "shield" && (
      <>
        <path
          d="M50,15 C65,18 80,15 80,15 C80,45 75,70 50,85 C25,70 20,45 20,15 C20,15 35,18 50,15 Z"
          fill="none"
          stroke="url(#cyber-grad)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M50,25 C60,27 70,25 70,25 C70,45 65,65 50,77 C35,65 30,45 30,25 C30,25 40,27 50,25 Z"
          fill="none"
          stroke="url(#cyber-grad)"
          strokeWidth="2.5"
          opacity="0.6"
          strokeLinejoin="round"
        />
      </>
    )}
    {type === "terminal" && (
      <>
        <rect x="15" y="25" width="70" height="50" rx="5" fill="none" stroke="url(#cyber-grad)" strokeWidth="4" />
        <path
          d="M25,42 L33,49 L25,56"
          fill="none"
          stroke="url(#cyber-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="38" y1="56" x2="53" y2="56" stroke="url(#cyber-grad)" strokeWidth="4.5" strokeLinecap="round" />
      </>
    )}
    {type === "server" && (
      <>
        <rect x="15" y="20" width="70" height="17" rx="3" fill="none" stroke="url(#cyber-grad)" strokeWidth="4" />
        <circle cx="28" cy="28.5" r="3" fill="#00d1b7" className="animate-star-twinkle-1" />
        <circle cx="38" cy="28.5" r="3" fill="#d648ff" className="animate-star-twinkle-2" />
        <line x1="48" y1="28.5" x2="72" y2="28.5" stroke="url(#cyber-grad)" strokeWidth="3" strokeDasharray="5 5" />

        <rect x="15" y="41.5" width="70" height="17" rx="3" fill="none" stroke="url(#cyber-grad)" strokeWidth="4" />
        <circle cx="28" cy="50" r="3" fill="#00d1b7" className="animate-star-twinkle-2" />
        <circle cx="38" cy="50" r="3" fill="#d648ff" className="animate-star-twinkle-3" />
        <line x1="48" y1="50" x2="72" y2="50" stroke="url(#cyber-grad)" strokeWidth="3" strokeDasharray="5 5" />

        <rect x="15" y="63" width="70" height="17" rx="3" fill="none" stroke="url(#cyber-grad)" strokeWidth="4" />
        <circle cx="28" cy="71.5" r="3" fill="#00d1b7" className="animate-star-twinkle-3" />
        <circle cx="38" cy="71.5" r="3" fill="#d648ff" className="animate-star-twinkle-1" />
        <line x1="48" y1="71.5" x2="72" y2="71.5" stroke="url(#cyber-grad)" strokeWidth="3" strokeDasharray="5 5" />
      </>
    )}
  </svg>
);

export const HeroSection = () => {
  const { background, isHovering, handlers } = useMouseGlow(600, "rgba(139, 92, 246, 0.12)");
  const [glitch, setGlitch] = useState<{
    active: boolean;
    text: string;
    top: string;
    left: string;
    type: "text" | "bar";
  }>({
    active: false,
    text: "",
    top: "20%",
    left: "10%",
    type: "text",
  });

  useEffect(() => {
    const glitchPhrases = [
      "[SYSTEM] EXPLOIT RUNNING - OVERRIDE INITIATED",
      "duca-cybersec:~# ./decrypt_db.sh -force",
      ">>> BYPASSING NEURAL FIREWALL... [99%]",
      "WARNING: ACCESS DETECTED ON PORT 22",
      "01000100 01010101 01000011 01000001",
      "SYSTEM: ROOT ACCESS GRANTED TO SYSTEM/KERNEL",
      "NMAP SCAN: 192.168.1.1 [PORT 443 OPEN]",
      "BYPASSING SSL PINNING... SUCCESS",
      "[*] BUFFER OVERFLOW TRIGGERED",
      "STATUS: EXPLOITING VULNERABILITY [CVE-2026-9999]",
    ];

    let glitchTimeout: NodeJS.Timeout;

    const triggerGlitch = () => {
      const text = glitchPhrases[Math.floor(Math.random() * glitchPhrases.length)] || "";
      const top = `${Math.floor(Math.random() * 60) + 15}%`;
      const left = `${Math.floor(Math.random() * 50) + 10}%`;
      const type = Math.random() > 0.85 ? "bar" : "text";

      setGlitch({ active: true, text, top, left, type });

      setTimeout(() => {
        setGlitch((prev) => ({ ...prev, active: false }));
        const nextInterval = Math.floor(Math.random() * 6000) + 4000;
        glitchTimeout = setTimeout(triggerGlitch, nextInterval);
      }, 250);
    };

    glitchTimeout = setTimeout(triggerGlitch, 5000);

    return () => clearTimeout(glitchTimeout);
  }, []);

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

  const introDuration = shortAnimations ? 0.36 : 0.8;
  const ctaDuration = shortAnimations ? 0.24 : 0.5;
  const ctaDelay = shortAnimations ? 0.7 : 2;
  const encryptedSpeed = shortAnimations ? 6 : 18;

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-40"
      style={{ background: "var(--theme-bg)" }}
      {...handlers}
    >
      {/* Deep Space / Night Sky Background */}
      <div className="a11y-hero-overlay absolute inset-0 z-0 bg-gradient-to-b from-[#02010c] via-[#0b0518] to-[#12082b]" />

      {/* Twinkling Stars */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Star set 1 */}
        <div className="animate-star-twinkle-1 absolute top-[10%] left-[15%] h-[2px] w-[2px] rounded-full bg-white" />
        <div className="animate-star-twinkle-2 absolute top-[25%] left-[45%] h-[1.5px] w-[1.5px] rounded-full bg-white" />
        <div className="animate-star-twinkle-3 absolute top-[15%] left-[80%] h-[2px] w-[2px] rounded-full bg-white" />
        {/* Star set 2 */}
        <div className="animate-star-twinkle-2 absolute top-[30%] left-[25%] h-[1.5px] w-[1.5px] rounded-full bg-white" />
        <div className="animate-star-twinkle-1 absolute top-[8%] left-[65%] h-[2px] w-[2px] rounded-full bg-white" />
        <div className="animate-star-twinkle-3 absolute top-[22%] left-[90%] h-[1.5px] w-[1.5px] rounded-full bg-white" />
        {/* Star set 3 */}
        <div className="animate-star-twinkle-3 absolute top-[35%] left-[70%] h-[2px] w-[2px] rounded-full bg-white" />
        <div className="animate-star-twinkle-1 absolute top-[18%] left-[5%] h-[1.5px] w-[1.5px] rounded-full bg-white" />
        <div className="animate-star-twinkle-2 absolute top-[28%] left-[55%] h-[2px] w-[2px] rounded-full bg-white" />
      </div>

      {/* Synthwave Logo (replaces Sun) */}
      <div className="pointer-events-none absolute top-[110px] right-0 bottom-[40%] left-0 z-0 flex items-center justify-center px-4 select-none md:top-[130px]">
        {/* Glow Aura behind the logo */}
        <div className="absolute h-[280px] w-[280px] rounded-full bg-gradient-to-b from-[#d648ff]/25 to-[#00d1b7]/20 opacity-80 blur-[50px] md:h-[480px] md:w-[480px] md:blur-[80px]" />
        {/* Logo Image with bottom gradient fade mask */}
        <img
          src="/duca.png"
          alt="DUCA Logo"
          className="animate-float relative z-10 h-full w-auto max-w-full object-contain"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, black 45%, transparent 90%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 45%, transparent 90%)",
          }}
        />
      </div>

      {/* Retro Wireframe Mountains */}
      <svg
        className="pointer-events-none absolute bottom-[40%] left-0 z-0 h-[100px] w-full select-none md:h-[140px]"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mountains-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d648ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00051a" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {/* Back mountains */}
        <path
          d="M0,120 L150,60 L320,100 L500,30 L720,95 L950,20 L1150,85 L1300,45 L1440,120 Z"
          fill="url(#mountains-grad)"
          stroke="#d648ff"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        {/* Front mountains */}
        <path
          d="M0,120 L220,80 L380,105 L580,50 L800,90 L1080,40 L1250,80 L1440,120 Z"
          fill="url(#mountains-grad)"
          stroke="#00d1b7"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />
      </svg>

      {/* 3D Floor Grid */}
      <div
        className="animate-synthwave-grid pointer-events-none absolute bottom-0 left-[-50%] z-0 h-[40%] w-[200%] origin-top overflow-hidden select-none"
        style={{
          transform: "perspective(180px) rotateX(65deg)",
          backgroundImage: `
            linear-gradient(to right, rgba(0, 209, 183, 0.18) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, rgba(0, 209, 183, 0.18) 1.5px, transparent 1.5px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Perspective Retro Road */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[40%] w-full overflow-visible select-none"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="road-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#12082b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#02010c" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Road surface */}
        <polygon points="475,0 525,0 780,500 220,500" fill="url(#road-grad)" opacity="0.9" />

        {/* Neon Pink Road Borders */}
        <line x1="475" y1="0" x2="220" y2="500" stroke="#d648ff" strokeWidth="4" className="neon-glow-purple" />
        <line x1="525" y1="0" x2="780" y2="500" stroke="#d648ff" strokeWidth="4" className="neon-glow-purple" />

        {/* Center Dash lines (Cyan) */}
        <line
          x1="500"
          y1="0"
          x2="500"
          y2="500"
          stroke="#00d1b7"
          strokeWidth="3.5"
          strokeDasharray="40 60"
          className="neon-glow-bluish-green animate-synthwave-road"
        />
      </svg>

      {/* Horizon Blend & Neon Light bar */}
      <div className="absolute bottom-[40%] left-0 z-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#00d1b7] to-transparent shadow-[0_0_8px_#00d1b7,0_0_15px_#00d1b7]" />
      <div className="pointer-events-none absolute bottom-[38%] left-0 z-0 h-[8%] w-full bg-gradient-to-t from-transparent to-[#00d1b7]/12 blur-[4px]" />

      {/* Scrolling Cyber Security / IT Icons - Left Side */}
      {/* `both` fill mode holds the 0% keyframe (opacity 0) during animation-delay,
          so staggered icons stay hidden until their scroll begins instead of
          flashing bunched-up at their default position on load. */}
      <CyberIcon
        type="lock"
        className="h-[80px] w-[80px] origin-bottom-left md:h-[120px] md:w-[120px]"
        style={{ animation: "cyber-scroll-left 6s cubic-bezier(0.8, 0, 1, 1) infinite both", animationDelay: "0s" }}
      />
      <CyberIcon
        type="terminal"
        className="h-[80px] w-[80px] origin-bottom-left md:h-[120px] md:w-[120px]"
        style={{ animation: "cyber-scroll-left 6s cubic-bezier(0.8, 0, 1, 1) infinite both", animationDelay: "2s" }}
      />
      <CyberIcon
        type="server"
        className="h-[80px] w-[80px] origin-bottom-left md:h-[120px] md:w-[120px]"
        style={{ animation: "cyber-scroll-left 6s cubic-bezier(0.8, 0, 1, 1) infinite both", animationDelay: "4s" }}
      />

      {/* Scrolling Cyber Security / IT Icons - Right Side */}
      <CyberIcon
        type="shield"
        className="h-[80px] w-[80px] origin-bottom-right md:h-[120px] md:w-[120px]"
        style={{ animation: "cyber-scroll-right 6s cubic-bezier(0.8, 0, 1, 1) infinite both", animationDelay: "1s" }}
      />
      <CyberIcon
        type="server"
        className="h-[80px] w-[80px] origin-bottom-right md:h-[120px] md:w-[120px]"
        style={{ animation: "cyber-scroll-right 6s cubic-bezier(0.8, 0, 1, 1) infinite both", animationDelay: "3s" }}
      />
      <CyberIcon
        type="lock"
        className="h-[80px] w-[80px] origin-bottom-right md:h-[120px] md:w-[120px]"
        style={{ animation: "cyber-scroll-right 6s cubic-bezier(0.8, 0, 1, 1) infinite both", animationDelay: "5s" }}
      />

      {/* Bottom transition blend layer (blends 3D grid/road smoothly into the next section's flat grid) */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-[2] h-[280px] w-full bg-gradient-to-t from-[#00051a] via-[#00051a]/40 via-[#00051a]/85 to-transparent" />

      {/* Mouse-reactive torch glow — illuminates the grid as the cursor moves */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-500"
        style={{ background, opacity: isHovering ? 1 : 0 }}
      />
      {/* Soft radial backdrop shadow behind text (spans full height & width to prevent any clipping borders) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 48%, rgba(2, 1, 12, 0.95) 0%, rgba(2, 1, 12, 0.7) 35%, rgba(2, 1, 12, 0.3) 65%, rgba(2, 1, 12, 0.1) 85%, transparent 100%)",
        }}
      />

      {/* Random Cybersecurity Terminal Glitch Effect Overlay */}
      {glitch.active && glitch.type === "text" && (
        <div
          className="animate-cyber-glitch pointer-events-none absolute z-0 font-mono text-base font-bold tracking-wider text-[#00d1b7]/80 select-none md:text-xl"
          style={{
            top: glitch.top,
            left: glitch.left,
            textShadow: "0 0 8px rgba(0, 209, 183, 0.8), -2px 0 #d648ff, 2px 0 #00d1b7",
          }}
        >
          {glitch.text}
        </div>
      )}
      {glitch.active && glitch.type === "bar" && (
        <div
          className="pointer-events-none absolute right-0 left-0 z-0 h-[6px] bg-gradient-to-r from-transparent via-[#d648ff]/45 to-transparent select-none"
          style={{
            top: glitch.top,
            boxShadow: "0 0 10px #d648ff, 0 0 20px #00d1b7",
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: introDuration }}
          className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center"
        >
          {/* Encrypted DUCA Title */}
          <h1 className="a11y-hero-title a11y-gradient-text mb-4 bg-gradient-to-r from-purple-300 via-fuchsia-400 to-cyan-300 bg-clip-text text-7xl font-bold tracking-tight text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.35)] md:text-9xl">
            DUCA
          </h1>

          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            <span className="a11y-hero-subtitle a11y-gradient-text bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              Deakin University Cybersecurity Association
            </span>
          </h2>

          <div className="w-full text-balance xl:w-4/5">
            <EncryptedText
              text="Building a community of cybersecurity enthusiasts at Deakin University. Learn, share, and grow together with
            Australia's leading student cyber club."
              className="a11y-hero-body text-balance text-white"
              speed={encryptedSpeed}
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
            {/*<GlowingButton href="/join/">Join Us</GlowingButton>*/}
            <Button href="/join/" variant="primary">
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
