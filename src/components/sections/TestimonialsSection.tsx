"use client";
import { InfiniteMovingCards } from "@ui/infinite-moving-cards";
import { SectionHeading } from "@ui/section-heading";

// Member testimonials — replace with real, attributed quotes when collected.
const testimonials = [
  {
    quote:
      "DUCA has been instrumental in my cybersecurity journey. The workshops and CTF events give you practical skills you can take straight into industry.",
    name: "DUCA Member",
    title: "Deakin Cybersecurity Student",
  },
  {
    quote:
      "The community at DUCA is amazing. I've made lifelong friends and professional connections that have shaped where my career is heading.",
    name: "DUCA Member",
    title: "Deakin Cybersecurity Student",
  },
  {
    quote:
      "As a beginner I was nervous about joining, but DUCA welcomes everyone regardless of skill level. The mentorship has been invaluable.",
    name: "DUCA Member",
    title: "Deakin Computer Science Student",
  },
  {
    quote:
      "The CTFs DUCA runs are top-notch. They've sharpened the problem-solving skills that set me apart in technical interviews.",
    name: "DUCA Member",
    title: "Deakin IT Student",
  },
  {
    quote:
      "DUCA's industry nights connected me with mentors who guided my path into cybersecurity. Couldn't have asked for a better launchpad.",
    name: "DUCA Member",
    title: "Deakin Cybersecurity Student",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="section-themed relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-purple-900/5 to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        <SectionHeading title="Why join us?" subtitle="Hear from our members about their experiences with DUCA" />

        <div className="mt-12">
          <InfiniteMovingCards items={testimonials} direction="left" speed="slow" pauseOnHover={true} />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
