"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const terminalLines = [
  { prompt: "$ ", text: "whoami", delay: 80 },
  { prompt: "", text: "DUCA - Deakin University Cybersecurity Association", delay: 30 },
  { prompt: "", text: "", delay: 500 },
  { prompt: "$ ", text: "cat mission.txt", delay: 80 },
  { prompt: "", text: "Building a community of cybersecurity enthusiasts", delay: 30 },
  { prompt: "", text: "at Deakin University. Learn, share, and grow together.", delay: 30 },
  { prompt: "", text: "", delay: 500 },
  { prompt: "$ ", text: "ls divisions/", delay: 80 },
  { prompt: "", text: "penetration-testing/  networking/  cyber-essentials/", delay: 30 },
  { prompt: "", text: "ctf/  development/  advertising/", delay: 30 },
  { prompt: "", text: "", delay: 500 },
  { prompt: "$ ", text: "echo $MEMBERS", delay: 80 },
  { prompt: "", text: "750+ and growing...", delay: 30 },
  { prompt: "", text: "", delay: 500 },
  {
    prompt: "$ ",
    text: 'echo "Join us → dusa.org.au/clubs/deakin-university-cybersecurity-association-burwood-duca"',
    delay: 80,
  },
  {
    prompt: "",
    text: "Join us → dusa.org.au/clubs/deakin-university-cybersecurity-association-burwood-duca",
    delay: 30,
  },
];

export function TerminalTyping({ className }: { className?: string }) {
  const [displayedLines, setDisplayedLines] = useState<{ prompt: string; text: string; isTyping: boolean }[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!started) return;
    if (currentLineIdx >= terminalLines.length) return;

    const line = terminalLines[currentLineIdx]!;
    const fullText = line.text;

    if (fullText === "") {
      // Empty line - just add it and move on
      setDisplayedLines((prev) => [
        ...prev.slice(0, -1).map((l) => ({ ...l, isTyping: false })),
        { prompt: "", text: "", isTyping: false },
      ]);
      const timer = setTimeout(() => {
        setCurrentLineIdx((i) => i + 1);
        setCurrentCharIdx(0);
      }, 300);
      return () => clearTimeout(timer);
    }

    if (currentCharIdx === 0) {
      // Start new line
      setDisplayedLines((prev) => [
        ...prev.map((l) => ({ ...l, isTyping: false })),
        { prompt: line.prompt, text: "", isTyping: true },
      ]);
    }

    if (currentCharIdx < fullText.length) {
      const timer = setTimeout(
        () => {
          setDisplayedLines((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1]!;
            updated[updated.length - 1] = {
              prompt: last.prompt,
              text: fullText.slice(0, currentCharIdx + 1),
              isTyping: last.isTyping,
            };
            return updated;
          });
          setCurrentCharIdx((c) => c + 1);
        },
        line.prompt ? line.delay : line.delay,
      );
      return () => clearTimeout(timer);
    } else {
      // Line complete, move to next
      const timer = setTimeout(() => {
        setCurrentLineIdx((i) => i + 1);
        setCurrentCharIdx(0);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [started, currentLineIdx, currentCharIdx]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedLines]);

  // Start animation when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry!.isIntersecting && !started) {
          setStarted(true);
          setDisplayedLines([{ prompt: terminalLines[0]!.prompt, text: "", isTyping: true }]);
        }
      },
      { threshold: 0.3 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [started]);

  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    return (
      <div
        className={`overflow-hidden rounded-xl font-mono text-sm ${className ?? ""}`}
        style={{
          background: "#0c1220",
          border: "1px solid rgba(51, 255, 51, 0.2)",
        }}
      >
        <div className="flex items-center gap-2 border-b border-green-900/30 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-3 text-xs" style={{ color: "rgba(51,255,51,0.5)" }}>
            duca@terminal ~ $
          </span>
        </div>
        <div className="space-y-1 p-4">
          {terminalLines.map((line, i) => (
            <div key={i} style={{ color: line.prompt ? "#33ff33" : "rgba(51,255,51,0.7)" }}>
              <span style={{ color: "rgba(51,255,51,0.5)" }}>{line.prompt}</span>
              {line.text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`overflow-hidden rounded-xl font-mono text-sm ${className ?? ""}`}
      style={{
        background: "#0c1220",
        border: "1px solid rgba(51, 255, 51, 0.2)",
        boxShadow: "0 0 30px rgba(51, 255, 51, 0.05)",
      }}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 border-b border-green-900/30 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-3 text-xs" style={{ color: "rgba(51,255,51,0.5)" }}>
          duca@terminal ~ $
        </span>
      </div>

      {/* Terminal Content */}
      <div ref={containerRef} className="scrollbar-hide max-h-100 space-y-1 overflow-y-auto p-4">
        {displayedLines.map((line, i) => (
          <div
            key={i}
            style={{
              color: line.prompt ? "#33ff33" : "rgba(51,255,51,0.7)",
            }}
          >
            <span style={{ color: "rgba(51,255,51,0.5)" }}>{line.prompt}</span>
            {line.text}
            {line.isTyping && i === displayedLines.length - 1 && <span className="ml-0.5 animate-pulse">█</span>}
          </div>
        ))}
        {currentLineIdx >= terminalLines.length && (
          <div style={{ color: "#33ff33" }}>
            <span style={{ color: "rgba(51,255,51,0.5)" }}>$ </span>
            <span className="animate-pulse">█</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default TerminalTyping;
