import { getCollection, type CollectionEntry } from 'astro:content';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const timeZone = 'Australia/Melbourne';
const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const timeFormatter = new Intl.DateTimeFormat('en-AU', {
  timeZone,
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});
const formatTime = (date: Date) => timeFormatter.format(date).replace(/[\u00a0\u202f]/g, ' ').toLowerCase();

export interface EventData {
  title: string;
  body: string;
  html?: string;
  iso: string;
  endIso: string;
  date: string;
  fullDate: string;
  homeDate: string;
  time: string;
  place: string;
  locationUrl?: string;
  registrationUrl?: string;
  image?: string;
  tags: string[];
  kind: 'CTF' | 'WORKSHOP' | 'INDUSTRY' | 'SOCIAL' | 'CONFERENCE' | 'COMMUNITY';
  slug: string;
  url: string;
  dateOnly: boolean;
  hasEndTime: boolean;
  featured: boolean;
}

function calendarParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find(part => part.type === type)?.value ?? '';
  return {
    year: Number(value('year')),
    month: Number(value('month')),
    day: Number(value('day')),
    weekday: value('weekday').toUpperCase(),
  };
}

function endOfLocalDay(date: Date): Date {
  const { year, month, day } = calendarParts(date);
  // Melbourne's offset at the end of this calendar day, including daylight saving.
  const offsetPart = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    timeZoneName: 'longOffset',
  }).formatToParts(new Date(Date.UTC(year, month - 1, day, 12)))
    .find(part => part.type === 'timeZoneName')?.value ?? 'GMT+00:00';
  const [, sign = '+', hours = '0', minutes = '0'] = offsetPart.match(/GMT([+-])(\d{2}):(\d{2})/) ?? [];
  const offset = (Number(hours) * 60 + Number(minutes)) * 60_000 * (sign === '-' ? -1 : 1);
  return new Date(Date.UTC(year, month - 1, day + 1) - offset - 1);
}

function classifyEvent(tags: string[]): EventData['kind'] {
  const normalized = tags.map(tag => tag.toLowerCase());
  if (normalized.some(tag => tag === 'ctf' || tag.includes('capture the flag'))) return 'CTF';
  if (normalized.includes('workshop')) return 'WORKSHOP';
  if (normalized.includes('industry')) return 'INDUSTRY';
  if (normalized.includes('social')) return 'SOCIAL';
  if (normalized.includes('conference')) return 'CONFERENCE';
  return 'COMMUNITY';
}

export async function getEvents(): Promise<CollectionEntry<'events'>[]> {
  const events = await getCollection('events');
  return events.sort((a, b) => a.data.eventDate.getTime() - b.data.eventDate.getTime());
}

export function toEventData(event: CollectionEntry<'events'>): EventData {
  const data = event.data;
  const { year, month, day, weekday } = calendarParts(data.eventDate);
  const date = `${String(day).padStart(2, '0')} ${monthNames[month - 1]}`;
  const fullDate = `${date} ${year}`;
  const dateOnly = data.dateOnly;
  // Missing end times use the local day's end only for archive classification.
  // They do not imply a public event duration.
  const endDate = data.endDate ?? endOfLocalDay(data.eventDate);
  const image = data.featuredImage?.startsWith('/events/')
    && existsSync(resolve('public', data.featuredImage.slice(1)))
    ? data.featuredImage
    : undefined;

  return {
    title: data.title,
    body: data.description,
    html: event.rendered?.html || undefined,
    iso: data.eventDate.toISOString(),
    endIso: endDate.toISOString(),
    date,
    fullDate,
    homeDate: `${weekday} ${fullDate}`,
    time: dateOnly ? 'To be confirmed' : [data.eventDate, ...(data.endDate ? [data.endDate] : [])].map(formatTime).join(' – '),
    place: data.location,
    locationUrl: data.locationUrl,
    registrationUrl: data.registrationUrl,
    image,
    tags: data.tags,
    kind: classifyEvent(data.tags),
    slug: data.slug,
    url: `/events/#event-${data.slug}`,
    dateOnly,
    hasEndTime: !!data.endDate,
    featured: data.featured,
  };
}
