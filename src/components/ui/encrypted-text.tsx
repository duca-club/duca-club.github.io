"use client";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/utils/cn";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export const EncryptedText = ({
  text,
  className,
  speed = 50,
  revealDelay = 100,
  disableAnimation = false,
}: {
  text: string;
  className?: string;
  speed?: number;
  revealDelay?: number;
  disableAnimation?: boolean;
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (disableAnimation) {
      setDisplayText(text);
      setIsAnimating(false);
      return;
    }

    let iteration = 0;

    const animate = () => {
      intervalRef.current = setInterval(() => {
        setDisplayText((_prev) =>
          text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join(""),
        );

        if (iteration >= text.length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setIsAnimating(false);
        }

        iteration += 1 / 3;
      }, speed);
    };

    const delayTimeout = setTimeout(animate, revealDelay);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearTimeout(delayTimeout);
    };
  }, [text, speed, revealDelay, disableAnimation]);

  return <span className={cn("font-mono", isAnimating && "text-purple-400", className)}>{displayText}</span>;
};

export default EncryptedText;
