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
}: {
  events: Event[];
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

  return (
    <section className="py-24 section-themed">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Upcoming Events"
          subtitle="Join us for workshops, networking, and hands-on learning"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {events.map((event, index) => (
            <motion.article
              key={event.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden theme-card border hover:border-purple-500/30 transition-all duration-300"
            >
              {/* Event Image/Gradient Background */}
              <div
                className="h-48 bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-slate-900"
                style={{
                  backgroundImage: event.featuredImage
                    ? `url(${event.featuredImage})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                  {new Date(event.eventDate).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    {event.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-white/10 backdrop-blur-sm text-white px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold theme-text mb-2 group-hover:text-purple-400 transition-colors">
                  {event.title}
                </h3>

                <p className="theme-text-secondary text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 text-sm theme-text-secondary">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatTime(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  <a
                    href={`/events/${event.slug}`}
                    className="flex-1 text-center py-2 px-4 rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors text-sm font-medium"
                  >
                    Learn More
                  </a>
                  {event.registrationUrl && (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 px-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      Register
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="theme-text-secondary text-lg">
              No upcoming events scheduled. Check back soon!
            </p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button href="/events" variant="outline">
            View All Events
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedEventsSection;
