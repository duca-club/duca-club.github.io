"use client";
import { cn } from "@/utils/cn";

// Positions are derived from the index (not Math.random) so the server and
// client render identical markup and Astro hydration doesn't mismatch.
export const Meteors = ({
  number = 12,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = Array.from({ length: number }, (_, idx) => ({
    left: `${(idx * 83) % 100}%`,
    delay: `${((idx * 37) % 60) / 10}s`,
    duration: `${5 + ((idx * 53) % 40) / 10}s`,
  }));

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {meteors.map((meteor, idx) => (
        <span
          key={idx}
          className="animate-meteor absolute -top-10 h-0.5 w-0.5 rounded-full bg-emerald-400 shadow-[0_0_0_1px_rgba(16,185,129,0.1)] before:absolute before:top-1/2 before:h-px before:w-[60px] before:-translate-y-1/2 before:bg-gradient-to-r before:from-emerald-400 before:to-transparent before:content-['']"
          style={{
            left: meteor.left,
            animationDelay: meteor.delay,
            animationDuration: meteor.duration,
          }}
        />
      ))}
    </div>
  );
};

export default Meteors;
