"use client";
import { motion } from "framer-motion";
import { CardSpotlight } from "@ui/card-spotlight";
import { SectionHeading } from "@ui/section-heading";
import { Meteors } from "@ui/meteors";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  image?: string;
}

const accents = [
  {
    grad: "from-emerald-500/20 via-emerald-700/20 to-cyan-700/30",
    ring: "hover:border-emerald-500/60",
    title: "group-hover:text-emerald-400",
    tag: "bg-emerald-500/10 text-emerald-400",
    glow: "from-emerald-500/0 via-emerald-500/40 to-cyan-500/0",
    icon: "🔐",
  },
  {
    grad: "from-purple-500/20 via-fuchsia-700/20 to-indigo-700/30",
    ring: "hover:border-purple-500/60",
    title: "group-hover:text-purple-300",
    tag: "bg-purple-500/10 text-purple-300",
    glow: "from-purple-500/0 via-fuchsia-500/40 to-indigo-500/0",
    icon: "🛡️",
  },
  {
    grad: "from-cyan-500/20 via-sky-700/20 to-blue-700/30",
    ring: "hover:border-cyan-500/60",
    title: "group-hover:text-cyan-300",
    tag: "bg-cyan-500/10 text-cyan-300",
    glow: "from-cyan-500/0 via-sky-500/40 to-blue-500/0",
    icon: "⚡",
  },
];

const FeaturedProjectCard = ({ project }: { project: Project }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="lg:col-span-2"
  >
    <a href={`/portfolio/${project.id}/`} className="group block h-full">
      <CardSpotlight
        color="rgba(16, 185, 129, 0.12)"
        className="h-full overflow-hidden rounded-2xl border-slate-800 p-0 transition-colors duration-300 hover:border-emerald-500/50"
      >
        <Meteors number={14} />
        <div className="relative z-10 flex h-full flex-col gap-8 p-8 md:flex-row md:items-center">
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-400 uppercase">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Featured project
            </span>
            <h3 className="theme-text mt-5 text-3xl font-bold transition-colors group-hover:text-emerald-400 md:text-4xl">
              {project.title}
            </h3>
            <p className="theme-text-muted mt-2 text-sm">by {project.author}</p>
            <p className="theme-text-secondary mt-4">{project.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                  {tag}
                </span>
              ))}
            </div>
            <span className="mt-8 inline-flex items-center gap-2 font-semibold text-emerald-400">
              View project
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </span>
          </div>
          {project.image && (
            <div className="md:w-2/5">
              <img
                src={project.image}
                alt=""
                loading="lazy"
                className="w-full rounded-xl border border-slate-800 transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
          )}
        </div>
      </CardSpotlight>
    </a>
  </motion.div>
);

const YourProjectHereCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.15 }}
    className="lg:col-span-1"
  >
    <div className="animate-border-glow theme-card flex h-full flex-col justify-between rounded-2xl border border-emerald-500/30 p-8">
      <div>
        <span className="font-mono text-xs text-emerald-500/80">~/duca/projects</span>
        <p className="theme-text-secondary mt-4 font-mono text-sm">
          <span className="text-emerald-400">$</span> git init your-idea
          <span className="animate-pulse text-emerald-400">▍</span>
        </p>
        <h3 className="theme-text mt-6 text-2xl font-bold">Your project here</h3>
        <p className="theme-text-secondary mt-3">
          Have an idea? The Development Division will help you plan it, build it, and ship it alongside a supportive
          team.
        </p>
      </div>
      <a
        href="/join/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        Pitch an idea
      </a>
    </div>
  </motion.div>
);

export const ProjectsShowcaseSection = ({ projects }: { projects: Project[] }) => {
  const [featured, ...rest] = projects;

  return (
    <>
      <SectionHeading
        title="Our Projects"
        subtitle="Real-world projects built and run by DUCA members"
        titleClassName="from-emerald-400 via-teal-400 to-cyan-500"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {featured && <FeaturedProjectCard project={featured} />}
        <YourProjectHereCard />
      </div>

      {rest.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((project, i) => {
            const a = accents[i % accents.length]!;
            return (
              <motion.a
                key={project.id}
                href={`/portfolio/${project.id}/`}
                className="group relative"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              >
                <div
                  className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60 ${a.glow}`}
                />
                <div
                  className={`theme-card theme-border relative h-full rounded-2xl border p-6 transition-all duration-300 ${a.ring} group-hover:-translate-y-1`}
                >
                  <div className={`mb-6 flex h-40 items-center justify-center rounded-xl bg-gradient-to-br ${a.grad}`}>
                    {project.image ? (
                      <img src={project.image} alt="" loading="lazy" className="h-full w-full rounded-xl object-cover" />
                    ) : (
                      <span className="text-6xl opacity-70 transition-transform duration-300 group-hover:scale-110">
                        {a.icon}
                      </span>
                    )}
                  </div>
                  <h3 className={`theme-text mb-2 text-xl font-bold transition-colors ${a.title}`}>{project.title}</h3>
                  <p className="theme-text-secondary mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className={`rounded-full px-2 py-1 text-xs ${a.tag}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ProjectsShowcaseSection;
