"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EventData {
  title: string;
  description: string;
  eventDate: string;
  endDate?: string;
  location: string;
  tags?: string[];
  registrationUrl?: string;
  slug: string;
}

interface EventTagFilterProps {
  events: EventData[];
  tags: string[];
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Australia/Melbourne",
  });
};

export function EventTagFilter({ events, tags }: EventTagFilterProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const clearTags = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  const now = new Date();

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (selectedTags.length > 0) {
      filtered = filtered.filter((event) => event.tags?.some((tag) => selectedTags.includes(tag)));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(q) ||
          event.description.toLowerCase().includes(q) ||
          event.location.toLowerCase().includes(q) ||
          event.tags?.some((tag) => tag.toLowerCase().includes(q)),
      );
    }
    return filtered;
  }, [events, selectedTags, searchQuery]);

  const pastEvents = filteredEvents
    .filter((e) => new Date(e.eventDate) < now)
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  return (
    <div>
      {/* Search Bar */}
      <div className="mx-auto mb-6 max-w-xl">
        <div className="relative">
          <svg
            className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full rounded-xl border border-gray-700/50 bg-gray-900/60 py-3 pr-4 pl-12 font-mono text-sm text-white transition-all placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Tag Filter Chips */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          onClick={clearTags}
          className={`events-page-tag-filter-chip rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
            selectedTags.length === 0 && !searchQuery
              ? "events-page-tag-filter-chip-active bg-purple-600 text-white shadow-lg shadow-purple-600/30"
              : "events-page-tag-filter-chip-inactive border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`events-page-tag-filter-chip rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              selectedTags.includes(tag)
                ? "events-page-tag-filter-chip-active bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "events-page-tag-filter-chip-inactive border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 ? (
        <div className="border-t border-gray-700/50 pt-16">
          <h2 className="mb-2 text-center text-3xl font-bold text-white">Past Events</h2>
          <p className="mb-8 text-center text-gray-400">Highlights from our previous activities</p>
          <div className="flex flex-wrap justify-center gap-6">
            <AnimatePresence mode="popLayout">
              {pastEvents.map((event) => (
                <motion.a
                  key={event.slug}
                  href={`/events/${event.slug}/`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="a11y-scroll-overlay-card group block w-full rounded-xl border border-gray-700/50 bg-gray-900/60 p-6 transition-colors hover:border-purple-500/30 md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <div className="mb-2 flex items-center gap-2">
                    {event.tags?.slice(0, 1).map((tag) => (
                      <span key={tag} className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="a11y-scroll-overlay-title mt-2 mb-1 text-lg font-bold text-gray-200 transition-colors group-hover:text-purple-400">
                    {event.title}
                  </h3>
                  <p className="a11y-scroll-overlay-meta mb-2 text-sm text-gray-500">{formatDate(event.eventDate)}</p>
                  <p className="a11y-scroll-overlay-text line-clamp-2 text-sm text-gray-400">{event.description}</p>
                </motion.a>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-400">No past events match your search filters.</p>
        </div>
      )}
    </div>
  );
}

export default EventTagFilter;
