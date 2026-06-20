"use client";
import { motion } from "framer-motion";
import { TeamGrid, type TeamMember } from "@ui/team-card";
import { SectionHeading } from "@ui/section-heading";
import { Button } from "@ui/button";
import { SpotlightNew } from "@ui/spotlight";

interface Division {
  name: string;
  description: string;
  members: TeamMember[];
}

export const TeamSection = ({
  executives,
  showFullTeam = false,
}: {
  executives: TeamMember[];
  showFullTeam?: boolean;
}) => {
  return (
    <section id="team" className="section-themed relative overflow-hidden py-24">
      {/* Spotlight light beam effect matching the hero theme */}
      <SpotlightNew className="-top-30 left-0 opacity-20" fill="#d648ff" />
      {/* Background light gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-cyan-900/5 to-transparent" />
      <div className="container mx-auto px-4">
        <SectionHeading title="Meet the Team" subtitle="The passionate people behind DUCA's mission" />

        <TeamGrid members={executives} className="mt-12" />

        {!showFullTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Button href="/meet-the-team/" variant="outline">
              View Full Team & Divisions
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export const DivisionSection = ({ division }: { division: Division }) => {
  return (
    <section className="section-themed py-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">{division.name}</h2>
          <p className="mb-8 max-w-3xl text-gray-400 italic">{division.description}</p>
        </motion.div>

        <TeamGrid members={division.members} />
      </div>
    </section>
  );
};

export default TeamSection;
