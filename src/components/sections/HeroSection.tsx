"use client";
import { motion } from "framer-motion";
import { EncryptedText } from "@ui/encrypted-text";
import { Button } from "@ui/button";
import { useMouseGlow } from "@/utils/useMouseGlow";

// Neon Palm Tree component
const PalmTree = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg 
    viewBox="0 0 100 150" 
    className={`absolute pointer-events-none select-none z-0 ${className || ""}`}
    style={style}
  >
    <defs>
      <linearGradient id="palm-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#00f3ff" />
        <stop offset="70%" stopColor="#d648ff" />
        <stop offset="100%" stopColor="#ff007f" />
      </linearGradient>
    </defs>
    {/* Trunk */}
    <path 
      d="M50,150 Q46,90 42,40" 
      stroke="url(#palm-grad)" 
      strokeWidth="5" 
      fill="none" 
      strokeLinecap="round" 
    />
    
    {/* Leaves */}
    {/* Left side leaves */}
    <path d="M42,40 C32,35 15,35 10,45" stroke="url(#palm-grad)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M42,40 C34,25 20,20 15,28" stroke="url(#palm-grad)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M42,40 C38,15 30,10 25,18" stroke="url(#palm-grad)" strokeWidth="3" fill="none" strokeLinecap="round" />
    
    {/* Right side leaves */}
    <path d="M42,40 C46,15 56,10 61,18" stroke="url(#palm-grad)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M42,40 C50,25 62,20 67,28" stroke="url(#palm-grad)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M42,40 C52,35 67,35 72,45" stroke="url(#palm-grad)" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

export const HeroSection = () => {
  const { background, isHovering, handlers } = useMouseGlow(
    600,
    "rgba(139, 92, 246, 0.12)",
  );

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-40"
      style={{ background: "var(--theme-bg)" }}
      {...handlers}
    >
      {/* Deep Space / Night Sky Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#02010c] via-[#0b0518] to-[#12082b]" />

      {/* Twinkling Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Star set 1 */}
        <div className="absolute top-[10%] left-[15%] w-[2px] h-[2px] bg-white rounded-full animate-star-twinkle-1" />
        <div className="absolute top-[25%] left-[45%] w-[1.5px] h-[1.5px] bg-white rounded-full animate-star-twinkle-2" />
        <div className="absolute top-[15%] left-[80%] w-[2px] h-[2px] bg-white rounded-full animate-star-twinkle-3" />
        {/* Star set 2 */}
        <div className="absolute top-[30%] left-[25%] w-[1.5px] h-[1.5px] bg-white rounded-full animate-star-twinkle-2" />
        <div className="absolute top-[8%] left-[65%] w-[2px] h-[2px] bg-white rounded-full animate-star-twinkle-1" />
        <div className="absolute top-[22%] left-[90%] w-[1.5px] h-[1.5px] bg-white rounded-full animate-star-twinkle-3" />
        {/* Star set 3 */}
        <div className="absolute top-[35%] left-[70%] w-[2px] h-[2px] bg-white rounded-full animate-star-twinkle-3" />
        <div className="absolute top-[18%] left-[5%] w-[1.5px] h-[1.5px] bg-white rounded-full animate-star-twinkle-1" />
        <div className="absolute top-[28%] left-[55%] w-[2px] h-[2px] bg-white rounded-full animate-star-twinkle-2" />
      </div>

      {/* Synthwave Sun */}
      <div 
        className="absolute left-1/2 bottom-[40%] -translate-x-1/2 w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-b from-[#ffe600] via-[#ff007f] to-[#d648ff] opacity-85 neon-glow-sun select-none pointer-events-none z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 45%, transparent 45%, transparent 50%, black 50%, black 62%, transparent 62%, transparent 67%, black 67%, black 77%, transparent 77%, transparent 82%, black 82%, black 90%, transparent 90%, transparent 94%, black 94%, black 97%, transparent 97%, transparent 99%, black 99%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 45%, transparent 45%, transparent 50%, black 50%, black 62%, transparent 62%, transparent 67%, black 67%, black 77%, transparent 77%, transparent 82%, black 82%, black 90%, transparent 90%, transparent 94%, black 94%, black 97%, transparent 97%, transparent 99%, black 99%, black 100%)'
        }}
      />

      {/* Retro Wireframe Mountains */}
      <svg 
        className="absolute bottom-[40%] left-0 w-full h-[100px] md:h-[140px] pointer-events-none select-none z-0" 
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
          stroke="#00f3ff" 
          strokeWidth="1.5" 
          strokeOpacity="0.5" 
        />
      </svg>

      {/* 3D Floor Grid */}
      <div 
        className="absolute bottom-0 left-[-50%] w-[200%] h-[40%] overflow-hidden z-0 select-none pointer-events-none origin-top animate-synthwave-grid"
        style={{
          transform: 'perspective(180px) rotateX(65deg)',
          backgroundImage: `
            linear-gradient(to right, rgba(0, 243, 255, 0.18) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, rgba(0, 243, 255, 0.18) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Perspective Retro Road */}
      <svg 
        className="absolute bottom-0 left-0 w-full h-[40%] overflow-visible z-0 pointer-events-none select-none" 
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
        <line x1="475" y1="0" x2="220" y2="500" stroke="#ff007f" strokeWidth="4" className="neon-glow-pink" />
        <line x1="525" y1="0" x2="780" y2="500" stroke="#ff007f" strokeWidth="4" className="neon-glow-pink" />
        
        {/* Center Dash lines (Cyan) */}
        <line 
          x1="500" 
          y1="0" 
          x2="500" 
          y2="500" 
          stroke="#00f3ff" 
          strokeWidth="3.5" 
          strokeDasharray="40 60" 
          className="neon-glow-cyan animate-synthwave-road" 
        />
      </svg>

      {/* Horizon Blend & Neon Light bar */}
      <div className="absolute bottom-[40%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent shadow-[0_0_8px_#00f3ff,0_0_15px_#00f3ff] z-0" />
      <div className="absolute bottom-[38%] left-0 w-full h-[8%] bg-gradient-to-t from-transparent to-[#00f3ff]/12 blur-[4px] pointer-events-none z-0" />

      {/* Scrolling Palm Trees - Left Side */}
      <PalmTree className="w-[120px] h-[180px] md:w-[180px] md:h-[270px] origin-bottom-left" style={{ animation: 'palm-scroll-left 6s cubic-bezier(0.8, 0, 1, 1) infinite', animationDelay: '0s' }} />
      <PalmTree className="w-[120px] h-[180px] md:w-[180px] md:h-[270px] origin-bottom-left" style={{ animation: 'palm-scroll-left 6s cubic-bezier(0.8, 0, 1, 1) infinite', animationDelay: '2s' }} />
      <PalmTree className="w-[120px] h-[180px] md:w-[180px] md:h-[270px] origin-bottom-left" style={{ animation: 'palm-scroll-left 6s cubic-bezier(0.8, 0, 1, 1) infinite', animationDelay: '4s' }} />

      {/* Scrolling Palm Trees - Right Side */}
      <PalmTree className="w-[120px] h-[180px] md:w-[180px] md:h-[270px] origin-bottom-right" style={{ animation: 'palm-scroll-right 6s cubic-bezier(0.8, 0, 1, 1) infinite', animationDelay: '1s' }} />
      <PalmTree className="w-[120px] h-[180px] md:w-[180px] md:h-[270px] origin-bottom-right" style={{ animation: 'palm-scroll-right 6s cubic-bezier(0.8, 0, 1, 1) infinite', animationDelay: '3s' }} />
      <PalmTree className="w-[120px] h-[180px] md:w-[180px] md:h-[270px] origin-bottom-right" style={{ animation: 'palm-scroll-right 6s cubic-bezier(0.8, 0, 1, 1) infinite', animationDelay: '5s' }} />

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
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center"
        >
          {/* Encrypted DUCA Title */}
          <h1 className="mb-4 bg-gradient-to-r from-purple-300 via-fuchsia-400 to-cyan-300 bg-clip-text text-7xl font-bold tracking-tight text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.35)] md:text-9xl">
            DUCA
          </h1>

          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              Deakin University Cybersecurity Association
            </span>
          </h2>

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
           {/*<GlowingButton href="/join/">Join Us</GlowingButton>*/}
            <Button
              href="/join/"
              variant="primary"
            >
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
