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
          "fixed inset-x-0 top-4 z-5000 mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-full border border-white/20 bg-black/80 px-8 py-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] backdrop-blur-md",
          className,
        )}
      >
        {logo && <div className="mr-4">{logo}</div>}
        {navItems.map((navItem) => (
          <a
            key={navItem.link}
            href={navItem.link}
            className={cn(
              "relative flex items-center space-x-1 text-sm text-neutral-50 transition-colors hover:text-neutral-300",
            )}
          >
            <span className="hidden sm:block">{navItem.icon}</span>
            <span>{navItem.name}</span>
          </a>
        ))}
        <a
          href="/join"
          className="relative rounded-full border border-white/20 bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
        >
          <span>Join Us</span>
        </a>
      </motion.nav>
    </AnimatePresence>
  );
};

export const ResizableNavbar = ({ children, className }: { children: ReactNode; className?: string }) => {
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
      className={cn("fixed top-0 right-0 left-0 z-50 border-b border-white/10 backdrop-blur-md", className)}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">{children}</div>
    </motion.header>
  );
};

export default FloatingNav;
