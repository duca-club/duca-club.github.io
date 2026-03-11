"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { DEFAULT_DISCORD_MEMBER_COUNT, formatMemberCount } from "@/utils/discordMembers";

const JOIN_URL =
  "https://www.dusa.org.au/clubs/deakin-university-cybersecurity-association-burwood-duca";

const buildTerminalLines = (memberCount: number) => [
  { id: "whoami-cmd", prompt: "$ ", text: "whoami", delay: 80 },
  { id: "whoami-out", prompt: "", text: "DUCA - Deakin University Cybersecurity Association", delay: 30 },
  { id: "spacer-1", prompt: "", text: "", delay: 500 },
  { id: "mission-cmd", prompt: "$ ", text: "cat mission.txt", delay: 80 },
  { id: "mission-out-1", prompt: "", text: "Building a community of cybersecurity enthusiasts", delay: 30 },
  { id: "mission-out-2", prompt: "", text: "at Deakin University. Learn, share, and grow together.", delay: 30 },
  { id: "spacer-2", prompt: "", text: "", delay: 500 },
  { id: "divisions-cmd", prompt: "$ ", text: "ls divisions/", delay: 80 },
  { id: "divisions-out-1", prompt: "", text: "penetration-testing/  networking/  cyber-essentials/", delay: 30 },
  { id: "divisions-out-2", prompt: "", text: "ctf/  development/  advertising/", delay: 30 },
  { id: "spacer-3", prompt: "", text: "", delay: 500 },
  { id: "members-cmd", prompt: "$ ", text: "echo $members", delay: 80 },
  { id: "members-out", prompt: "", text: `${formatMemberCount(memberCount)}+ and growing...`, delay: 30 },
  { id: "spacer-4", prompt: "", text: "", delay: 500 },
  {
    id: "join-cmd",
    prompt: "$ ",
    text: "cat join.txt",
    delay: 80,
  },
  {
    id: "join-out",
    prompt: "",
    text: `Register -> ${JOIN_URL}`,
    delay: 30,
  },
];

function renderTerminalText(text: string) {
  const linkStart = text.indexOf(JOIN_URL);
  if (linkStart === -1) return text;

  const before = text.slice(0, linkStart);
  const after = text.slice(linkStart + JOIN_URL.length);

  return (
    <>
      {before}
      <a
        href={JOIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-green-400/60 underline-offset-2 hover:text-green-300"
        style={{ color: "#5dff5d" }}
      >
        {JOIN_URL}
      </a>
      {after}
    </>
  );
}

export function TerminalTyping({
  className,
  memberCount = DEFAULT_DISCORD_MEMBER_COUNT,
}: {
  className?: string;
  memberCount?: number;
}) {
  const terminalLines = useMemo(() => buildTerminalLines(memberCount), [memberCount]);
  const [displayedLines, setDisplayedLines] = useState<
    { id: string; prompt: string; text: string; isTyping: boolean }[]
  >([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [isRewinding, setIsRewinding] = useState(false);
  const previousMemberCountRef = useRef(memberCount);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRewinding) return;
    if (!started) return;
    if (currentLineIdx >= terminalLines.length) return;

    const line = terminalLines[currentLineIdx];
    if (!line) return;
    const fullText = line.text;

    if (fullText === "") {
      // Empty line - just add it and move on
      setDisplayedLines((prev) => [
        ...prev.map((l) => ({ ...l, isTyping: false })),
        { id: line.id, prompt: "", text: "", isTyping: false },
      ]);
      const timer = setTimeout(() => {
        setCurrentLineIdx((i) => i + 1);
        setCurrentCharIdx(0);
      }, line.delay);
      return () => clearTimeout(timer);
    }

    if (currentCharIdx === 0) {
      // Start new line
      setDisplayedLines((prev) => [
        ...prev.map((l) => ({ ...l, isTyping: false })),
        { id: line.id, prompt: line.prompt, text: "", isTyping: true },
      ]);
    }

    if (currentCharIdx < fullText.length) {
      const timer = setTimeout(
        () => {
          setDisplayedLines((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (!last) return prev;
            updated[updated.length - 1] = {
              ...last,
              text: fullText.slice(0, currentCharIdx + 1),
            };
            return updated;
          });
          setCurrentCharIdx((c) => c + 1);
        },
        line.delay
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
  }, [started, currentLineIdx, currentCharIdx, terminalLines, isRewinding]);

  useEffect(() => {
    if (!started) {
      previousMemberCountRef.current = memberCount;
      return;
    }

    if (memberCount === previousMemberCountRef.current) return;
    previousMemberCountRef.current = memberCount;
    setIsRewinding(true);
  }, [memberCount, started]);

  useEffect(() => {
    if (!isRewinding) return;

    if (displayedLines.length === 0) {
      setCurrentLineIdx(0);
      setCurrentCharIdx(0);
      setIsRewinding(false);
      return;
    }

    const lastLine = displayedLines[displayedLines.length - 1];
    if (!lastLine) return;
    const timer = setTimeout(() => {
      setDisplayedLines((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (!last) return prev;

        if (last.text.length > 0) {
          updated[updated.length - 1] = {
            ...last,
            text: last.text.slice(0, -1),
            isTyping: true,
          };
          return updated;
        }

        return updated.slice(0, -1);
      });
    }, lastLine.text.length > 0 ? 18 : 80);

    return () => clearTimeout(timer);
  }, [isRewinding, displayedLines]);

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
        if (!entry) return;
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [started]);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    return (
      <div
        className={`rounded-xl overflow-hidden font-mono text-sm ${className ?? ""}`}
        style={{
          background: "#0c1220",
          border: "1px solid rgba(51, 255, 51, 0.2)",
        }}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-green-900/30">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-3 text-xs" style={{ color: "rgba(51,255,51,0.5)" }}>
            duca@terminal ~ $
          </span>
        </div>
        <div className="p-4 space-y-1">
          {terminalLines.map((line) => (
            <div key={line.id} style={{ color: line.prompt ? "#33ff33" : "rgba(51,255,51,0.7)" }}>
              <span style={{ color: "rgba(51,255,51,0.5)" }}>{line.prompt}</span>
              {renderTerminalText(line.text)}
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
      className={`rounded-xl overflow-hidden font-mono text-sm ${className ?? ""}`}
      style={{
        background: "#0c1220",
        border: "1px solid rgba(51, 255, 51, 0.2)",
        boxShadow: "0 0 30px rgba(51, 255, 51, 0.05)",
      }}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-green-900/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-3 text-xs" style={{ color: "rgba(51,255,51,0.5)" }}>
          duca@terminal ~ $
        </span>
      </div>

      {/* Terminal Content */}
      <div
        ref={containerRef}
        className="p-4 space-y-1 max-h-[400px] overflow-y-auto scrollbar-hide"
      >
        {displayedLines.map((line, i) => (
          <div
            key={line.id}
            style={{
              color: line.prompt ? "#33ff33" : "rgba(51,255,51,0.7)",
            }}
          >
            <span style={{ color: "rgba(51,255,51,0.5)" }}>{line.prompt}</span>
            {renderTerminalText(line.text)}
            {line.isTyping && i === displayedLines.length - 1 && (
              <span className="animate-pulse ml-0.5">█</span>
            )}
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
