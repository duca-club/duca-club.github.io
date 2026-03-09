"use client";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedIn?: string;
  bio?: string;
}

export const TeamCard = ({
  member,
  className,
}: {
  member: TeamMember;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/80 border border-slate-700/50 p-6",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-purple-500/50 group-hover:ring-purple-500 transition-all">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
            {member.name}
          </h3>
          <p className="text-sm text-purple-400 mt-1">{member.role}</p>
          {member.bio && (
            <p className="text-sm text-gray-400 mt-3 line-clamp-3">{member.bio}</p>
          )}
        </div>

        {member.linkedIn && (
          <a
            href={member.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors"
          >
            <LinkedInIcon className="w-5 h-5" />
            <span>Connect</span>
          </a>
        )}
      </div>
    </motion.div>
  );
};

export const TeamGrid = ({
  members,
  className,
}: {
  members: TeamMember[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        className
      )}
    >
      {members.map((member, idx) => (
        <motion.div
          key={member.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          viewport={{ once: true }}
        >
          <TeamCard member={member} />
        </motion.div>
      ))}
    </div>
  );
};

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default TeamCard;
