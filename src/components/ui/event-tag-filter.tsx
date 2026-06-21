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
  });
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export function EventTagFilter({ events, tags }: EventTagFilterProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearTags = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  const now = new Date();

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (selectedTags.length > 0) {
      filtered = filtered.filter((event) =>
        event.tags?.some((tag) => selectedTags.includes(tag))
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(q) ||
          event.description.toLowerCase().includes(q) ||
          event.location.toLowerCase().includes(q) ||
          event.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [events, selectedTags, searchQuery]);

  const upcomingEvents = filteredEvents
    .filter((e) => new Date(e.eventDate) >= now)
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  const pastEvents = filteredEvents
    .filter((e) => new Date(e.eventDate) < now)
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  return (
    <div>
      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-6">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
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
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/60 border border-gray-700/50 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all font-mono text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Tag Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={clearTags}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            selectedTags.length === 0 && !searchQuery
              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
              : "bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20"
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              selectedTags.includes(tag)
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 ? (
        <div className="border-t border-gray-700/50 pt-16">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            Past Events
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Highlights from our previous activities
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="block p-6 rounded-xl bg-gray-900/60 border border-gray-700/50 hover:border-purple-500/30 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {event.tags?.slice(0, 1).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-gray-200 mt-2 mb-1 group-hover:text-purple-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    {formatDate(event.eventDate)}
                  </p>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {event.description}
                  </p>
                </motion.a>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No past events match your search filters.
          </p>
        </div>
      )}
    </div>
  );
}

export default EventTagFilter;
