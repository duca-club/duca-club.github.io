"use client";
import { motion } from "framer-motion";
import { SectionHeading } from "@ui/section-heading";
import { Button } from "@ui/button";

interface Event {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  registrationUrl?: string;
  slug: string;
  tags?: string[];
  featuredImage?: string;
}

export const FeaturedEventsSection = ({
  events,
  isSeamless = false,
}: {
  events: Event[];
  isSeamless?: boolean;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-AU", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const content = (
    <>
      <SectionHeading title="Upcoming Events" subtitle="Join us for workshops, networking, and hands-on learning" />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => (
          <motion.article
            key={event.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group theme-card relative overflow-hidden rounded-2xl border transition-all duration-300 hover:border-purple-500/30"
          >
            {/* Event Image/Gradient Background */}
            <div
              className="h-48 bg-linear-to-br from-purple-900/50 via-indigo-900/50 to-slate-900"
              style={{
                backgroundImage: event.featuredImage ? `url(${event.featuredImage})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />

              {/* Date Badge */}
              <div className="absolute top-4 left-4 rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white">
                {new Date(event.eventDate).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "short",
                })}
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="absolute top-4 right-4 flex gap-2">
                  {event.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded bg-white/10 px-2 py-1 text-xs text-white backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="theme-text mb-2 text-xl font-bold transition-colors group-hover:text-purple-400">
                {event.title}
              </h3>

              <p className="theme-text-secondary mb-4 line-clamp-2 text-sm">{event.description}</p>

              {/* Event Details */}
              <div className="theme-text-secondary space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{formatDate(event.eventDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{formatTime(event.eventDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6">
                <a
                  href={`/events/${event.slug}/`}
                  className="block w-full rounded-lg border border-purple-500/30 px-4 py-2 text-center text-sm font-medium text-purple-400 transition-colors hover:bg-purple-500/10"
                >
                  Learn More
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {events.length === 0 && (
        <div className="py-12 text-center">
          <p className="theme-text-secondary text-lg">No upcoming events scheduled. Check back soon!</p>
        </div>
      )}

      {events.length > 0 && !isSeamless && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Button href="/events/" variant="outline">
            View All Events
          </Button>
        </motion.div>
      )}
    </>
  );

  if (isSeamless) {
    return <div className="mt-20">{content}</div>;
  }

  return (
    <section className="section-themed py-24">
      <div className="container mx-auto px-4">{content}</div>
    </section>
  );
};

export default FeaturedEventsSection;
