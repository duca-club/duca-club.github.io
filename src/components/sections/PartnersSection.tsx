"use client";
import { InfiniteLogoCarousel } from "@ui/logo-carousel";
import { motion } from "framer-motion";
import { allPartnerLogos } from "@/data/partners";

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

        <InfiniteLogoCarousel partners={allPartnerLogos} direction="left" speed="slow" />
      </div>
    </section>
  );
};

export default PartnersSection;
