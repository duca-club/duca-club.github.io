"use client";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/utils/cn";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export const EncryptedText = ({
  text,
  className,
  speed = 50,
  revealDelay = 100,
}: {
  text: string;
  className?: string;
  speed?: number;
  revealDelay?: number;
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let iteration = 0;

    const animate = () => {
      intervalRef.current = setInterval(() => {
        setDisplayText((prev) =>
          text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
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
  }, [text, speed, revealDelay]);

  return (
    <span
      className={cn(
        "font-mono",
        isAnimating && "text-purple-400",
        className
      )}
    >
      {displayText}
    </span>
  );
};

export const HoverEncryptedText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
    let iteration = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }

      iteration += 1 / 2;
    }, 30);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setDisplayText(text);
  };

  return (
    <span
      className={cn("cursor-pointer font-mono", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </span>
  );
};

export default EncryptedText;
