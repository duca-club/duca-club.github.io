"use client";
import { motion } from "framer-motion";
import { EncryptedText } from "@ui/encrypted-text";
import { Button } from "@ui/button";
import { useMouseGlow } from "@/utils/useMouseGlow";

// Neon Cyber/IT Icon component
const CyberIcon = ({ type, className, style }: { type: 'lock' | 'shield' | 'terminal' | 'server'; className?: string; style?: React.CSSProperties }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={`absolute pointer-events-none select-none z-0 ${className || ""}`}
    style={style}
  >
    <defs>
      <linearGradient id="cyber-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#00f3ff" />
        <stop offset="60%" stopColor="#d648ff" />
        <stop offset="100%" stopColor="#ff007f" />
      </linearGradient>
    </defs>
    {type === 'lock' && (
      <>
        <path d="M30,45 L30,78 C30,80 32,82 34,82 L66,82 C68,82 70,80 70,78 L70,45 Z" fill="none" stroke="url(#cyber-grad)" strokeWidth="4" />
        <path d="M40,45 L40,30 C40,18 60,18 60,30 L60,45" fill="none" stroke="url(#cyber-grad)" strokeWidth="4" />
        <circle cx="50" cy="58" r="4.5" fill="url(#cyber-grad)" />
        <line x1="50" y1="62.5" x2="50" y2="71" stroke="url(#cyber-grad)" strokeWidth="3" strokeLinecap="round" />
      </>
    )}
    {type === 'shield' && (
      <>
        <path d="M50,15 C65,18 80,15 80,15 C80,45 75,70 50,85 C25,70 20,45 20,15 C20,15 35,18 50,15 Z" fill="none" stroke="url(#cyber-grad)" strokeWidth="4" strokeLinejoin="round" />
        <path d="M50,25 C60,27 70,25 70,25 C70,45 65,65 50,77 C35,65 30,45 30,25 C30,25 40,27 50,25 Z" fill="none" stroke="url(#cyber-grad)" strokeWidth="2.5" opacity="0.6" strokeLinejoin="round" />
      </>
    )}
    {type === 'terminal' && (
      <>
        <rect x="15" y="25" width="70" height="50" rx="5" fill="none" stroke="url(#cyber-grad)" strokeWidth="4" />
        <path d="M25,42 L33,49 L25,56" fill="none" stroke="url(#cyber-grad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="38" y1="56" x2="53" y2="56" stroke="url(#cyber-grad)" strokeWidth="4.5" strokeLinecap="round" />
      </>
    )}
    {type === 'server' && (
      <>
        <rect x="15" y="20" width="70" height="17" rx="3" fill="none" stroke="url(#cyber-grad)" strokeWidth="4" />
        <circle cx="28" cy="28.5" r="3" fill="#00f3ff" className="animate-star-twinkle-1" />
        <circle cx="38" cy="28.5" r="3" fill="#ff007f" className="animate-star-twinkle-2" />
        <line x1="48" y1="28.5" x2="72" y2="28.5" stroke="url(#cyber-grad)" strokeWidth="3" strokeDasharray="5 5" />

        <rect x="15" y="41.5" width="70" height="17" rx="3" fill="none" stroke="url(#cyber-grad)" strokeWidth="4" />
        <circle cx="28" cy="50" r="3" fill="#00f3ff" className="animate-star-twinkle-2" />
        <circle cx="38" cy="50" r="3" fill="#ff007f" className="animate-star-twinkle-3" />
        <line x1="48" y1="50" x2="72" y2="50" stroke="url(#cyber-grad)" strokeWidth="3" strokeDasharray="5 5" />

        <rect x="15" y="63" width="70" height="17" rx="3" fill="none" stroke="url(#cyber-grad)" strokeWidth="4" />
        <circle cx="28" cy="71.5" r="3" fill="#00f3ff" className="animate-star-twinkle-3" />
        <circle cx="38" cy="71.5" r="3" fill="#ff007f" className="animate-star-twinkle-1" />
        <line x1="48" y1="71.5" x2="72" y2="71.5" stroke="url(#cyber-grad)" strokeWidth="3" strokeDasharray="5 5" />
      </>
    )}
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

      {/* Synthwave Logo (replaces Sun) */}
      <div className="absolute left-1/2 bottom-[40%] -translate-x-1/2 w-[220px] h-[220px] md:w-[320px] md:h-[320px] z-0 flex items-center justify-center select-none pointer-events-none">
        {/* Glow Aura behind the logo */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#ff007f]/30 to-[#d648ff]/30 blur-[40px] opacity-75 md:blur-[60px]" />
        {/* Logo Image */}
        <img 
          src="/duca.png" 
          alt="DUCA Logo" 
          className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_20px_rgba(0,243,255,0.4)] drop-shadow-[0_0_40px_rgba(214,72,255,0.3)] animate-float"
        />
      </div>


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

      {/* Scrolling Cyber Security / IT Icons - Left Side */}
      <CyberIcon type="lock" className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] origin-bottom-left" style={{ animation: 'cyber-scroll-left 6s cubic-bezier(0.8, 0, 1, 1) infinite', animationDelay: '0s' }} />
      <CyberIcon type="terminal" className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] origin-bottom-left" style={{ animation: 'cyber-scroll-left 6s cubic-bezier(0.8, 0, 1, 1) infinite', animationDelay: '2s' }} />
      <CyberIcon type="server" className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] origin-bottom-left" style={{ animation: 'cyber-scroll-left 6s cubic-bezier(0.8, 0, 1, 1) infinite', animationDelay: '4s' }} />

      {/* Scrolling Cyber Security / IT Icons - Right Side */}
      <CyberIcon type="shield" className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] origin-bottom-right" style={{ animation: 'cyber-scroll-right 6s cubic-bezier(0.8, 0, 1, 1) infinite', animationDelay: '1s' }} />
      <CyberIcon type="server" className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] origin-bottom-right" style={{ animation: 'cyber-scroll-right 6s cubic-bezier(0.8, 0, 1, 1) infinite', animationDelay: '3s' }} />
      <CyberIcon type="lock" className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] origin-bottom-right" style={{ animation: 'cyber-scroll-right 6s cubic-bezier(0.8, 0, 1, 1) infinite', animationDelay: '5s' }} />

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
