"use client";
import { InfiniteLogoCarousel } from "@ui/logo-carousel";
import { motion } from "framer-motion";

const partners = [
  {
    name: "Deakin University",
    logo: "/partners/deakin.png",
    href: "https://www.deakin.edu.au/",
  },
  {
    name: "DUSA",
    logo: "/partners/dusa.png",
    href: "https://dusa.org.au/",
  },
  {
    name: "ACUCyS",
    logo: "/partners/acucys.png",
    href: "https://acucys.com.au/",
  },
  {
    name: "Deakin Cyber Research",
    logo: "/partners/deakin-cyber.png",
    href: "https://www.deakin.edu.au/information-technology/cyber-security-research",
  },
];

export const PartnersSection = () => {
  return (
    <section className="section-themed border-y border-slate-800 py-16">
      <div className="container mx-auto px-4">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 text-center text-sm tracking-wider text-gray-500 uppercase"
        >
          Proudly supported by
        </motion.p>

        <InfiniteLogoCarousel partners={partners} direction="left" speed="slow" />
      </div>
    </section>
  );
};

export default PartnersSection;
