import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const events = await getCollection('events');
  
  return rss({
    title: 'DUCA Events',
    description: 'Upcoming events and workshops by the Deakin University Cyber Security Club (DUCA)',
    site: context.site || 'https://duca-club.github.io',
    items: events.map((event) => ({
      title: event.data.title,
      pubDate: event.data.eventDate,
      description: event.data.description,
      // Map the slug correctly for Astro Content Collections
      link: `/events/${event.data.slug || event.id || ''}/`.replace(/\/\/$/, '/'),
    })),
    customData: `<language>en-au</language>`,
  });
}
