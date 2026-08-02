"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

interface CalendarEvent {
  title: string;
  slug: string;
  eventDate: string;
  tags?: string[];
}

export const EventsCalendar = ({
  events,
  className,
}: {
  events: CalendarEvent[];
  className?: string;
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  // On a static build the SSR'd month is frozen at build time; without this it
  // would flash the stale build-time month before hydration corrects it to the
  // visitor's real "now". Render a placeholder on the server and set the real
  // date only after mounting on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date());
  }, []);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};
    events.forEach((event) => {
      const date = new Date(event.eventDate);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [events]);

  const getEventsForDay = (day: number) => {
    const dateKey = `${currentYear}-${currentMonth}-${day}`;
    return eventsByDate[dateKey] || [];
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Generate calendar days
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Structural placeholder rendered on the server / before mount so no stale
  // build-time month is ever shown. Mirrors the real grid dimensions to avoid
  // layout shift when the calendar swaps in.
  if (!mounted) {
    return (
      <div className={cn("w-full", className)} aria-busy="true" aria-label="Loading calendar">
        <div className="flex items-center justify-between mb-6">
          <div className="h-9 w-9 rounded-lg theme-card border" />
          <div className="h-7 w-44 rounded theme-card" />
          <div className="h-9 w-9 rounded-lg theme-card border" />
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center py-2 text-sm font-medium theme-text-muted">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 42 }).map((_, i) => (
            <div key={i} className="min-h-[100px] rounded-lg border theme-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg theme-card border hover:border-violet-500/30 transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 theme-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold theme-text">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm rounded-full bg-violet-600 text-white hover:bg-violet-700 transition-colors"
          >
            Today
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg theme-card border hover:border-violet-500/30 transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 theme-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center py-2 text-sm font-medium theme-text-muted"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentMonth}-${currentYear}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-1"
        >
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-[100px]" />;
            }

            const dayEvents = getEventsForDay(day);
            const hasEvents = dayEvents.length > 0;

            return (
              <div
                key={day}
                className={cn(
                  "min-h-[100px] p-2 rounded-lg border transition-colors",
                  isToday(day)
                    ? "border-violet-500 bg-violet-500/10"
                    : "theme-card border hover:border-violet-500/30",
                  hasEvents && "cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "text-sm font-medium mb-1",
                    isToday(day) ? "text-violet-400" : "theme-text"
                  )}
                >
                  {day}
                </div>

                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <a
                      key={event.slug}
                      href={`/events/${event.slug}/`}
                      className="block p-1 rounded text-xs bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 transition-colors truncate"
                      title={event.title}
                    >
                      {event.title}
                    </a>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs theme-text-muted">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EventsCalendar;
