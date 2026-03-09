"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface NavItem {
  name: string;
  link: string;
  icon?: ReactNode;
}

export const FloatingNav = ({
  navItems,
  className,
  logo,
}: {
  navItems: NavItem[];
  className?: string;
  logo?: ReactNode;
}) => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={{ opacity: 1, y: 0 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex fixed top-4 inset-x-0 mx-auto max-w-fit items-center justify-center space-x-4 px-8 py-4 rounded-full border border-white/[0.2] bg-black/80 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000]",
          className
        )}
      >
        {logo && <div className="mr-4">{logo}</div>}
        {navItems.map((navItem) => (
          <a
            key={navItem.link}
            href={navItem.link}
            className={cn(
              "relative flex items-center space-x-1 text-neutral-50 hover:text-neutral-300 transition-colors text-sm"
            )}
          >
            <span className="hidden sm:block">{navItem.icon}</span>
            <span>{navItem.name}</span>
          </a>
        ))}
        <a
          href="https://dusa.org.au/clubs/duca"
          target="_blank"
          rel="noopener noreferrer"
          className="border text-sm font-medium relative border-white/[0.2] text-white px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          <span>Join Us</span>
        </a>
      </motion.nav>
    </AnimatePresence>
  );
};

export const ResizableNavbar = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{
        height: isScrolled ? 60 : 80,
        backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.9)" : "rgba(0, 0, 0, 0.7)",
      }}
      transition={{ duration: 0.2 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {children}
      </div>
    </motion.header>
  );
};

export default FloatingNav;
