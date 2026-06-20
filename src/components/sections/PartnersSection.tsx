"use client";
import { InfiniteLogoCarousel } from "@ui/logo-carousel";
import { motion } from "framer-motion";
import { allPartnerLogos } from "@/data/partners";
import { SpotlightNew } from "@ui/spotlight";

export const PartnersSection = () => {
  return (
    <section className="section-themed border-y border-slate-800/40 relative overflow-hidden py-16">
      {/* Spotlight light beam effect matching the hero theme */}
      <SpotlightNew className="-top-40 right-0 opacity-15" fill="#00d1b7" />
      {/* Background light gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-purple-900/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 text-center text-sm tracking-wider text-gray-500 uppercase"
        >
          Proudly supported by
        </motion.p>

        <InfiniteLogoCarousel partners={allPartnerLogos} direction="left" speed="slow" />
      </div>
    </section>
  );
};

export default PartnersSection;
