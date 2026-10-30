/** Build the event lists from the visitor's current time without mutating data. */
export function getEventSchedule(events, now, filter = 'All') {
  const ordered = [...events].sort((a, b) => Date.parse(a.iso) - Date.parse(b.iso));
  const upcoming = ordered.filter(event => Date.parse(event.endIso) > now);
  const past = ordered.filter(event => Date.parse(event.endIso) <= now).reverse();
  const selected = filter.toLowerCase();
  const matches = event => selected === 'all'
    || [event.kind, ...event.tags].some(tag => tag.toLowerCase() === selected);
  const categories = new Set(ordered.map(event => event.kind.toLowerCase()));
  const filters = ['All', ...['Workshop', 'CTF', 'Industry', 'Social', 'Conference', 'Community']
    .filter(category => categories.has(category.toLowerCase()))];
  const next = upcoming[0];
  const started = !!next && Date.parse(next.iso) <= now;

  return {
    upcoming,
    past,
    visibleEvents: upcoming.filter(matches),
    visiblePast: past.filter(matches),
    filters,
    next,
    started,
    liveNow: started && !next.dateOnly && next.hasEndTime,
  };
}
