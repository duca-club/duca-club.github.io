import test from 'node:test';
import assert from 'node:assert/strict';
import { getEventSchedule } from '../src/lib/event-state.js';

const pastWorkshop = {
  title: 'Speedrunning Cyber',
  iso: '2026-07-17T17:00:00+10:00',
  endIso: '2026-07-17T19:00:00+10:00',
  kind: 'WORKSHOP', tags: ['Career', 'Workshop'], hasEndTime: true,
};
const pastSocial = {
  title: 'Logoff',
  iso: '2026-09-11T18:00:00+10:00',
  endIso: '2026-09-11T21:00:00+10:00',
  kind: 'SOCIAL', tags: ['Social', 'Community'], hasEndTime: true,
};
const stall = {
  title: 'T1 O-Week stall',
  iso: '2027-02-22T10:00:00+11:00',
  endIso: '2027-02-22T23:59:59.999+11:00',
  kind: 'COMMUNITY', tags: ['Community', 'O-Week'], hasEndTime: false,
};

test('keeps archived events in newest-first history and selects the real next event', () => {
  const events = [stall, pastWorkshop, pastSocial];
  const result = getEventSchedule(events, Date.parse('2026-10-30T12:00:00+11:00'));
  assert.deepEqual(result.past.map(event => event.title), ['Logoff', 'Speedrunning Cyber']);
  assert.deepEqual(result.upcoming, [stall]);
  assert.equal(result.next, stall);
  assert.deepEqual(events, [stall, pastWorkshop, pastSocial]);
});

test('filters both upcoming and past events by category or secondary tag', () => {
  const now = Date.parse('2026-10-30T12:00:00+11:00');
  const events = [pastWorkshop, pastSocial, stall];
  assert.deepEqual(getEventSchedule(events, now, 'Workshop').visiblePast, [pastWorkshop]);
  assert.deepEqual(getEventSchedule(events, now, 'o-week').visibleEvents, [stall]);
  assert.deepEqual(getEventSchedule(events, now, 'Career').visiblePast, [pastWorkshop]);
});

test('uses the confirmed Melbourne 10am start without assuming a stall end time', () => {
  const before = getEventSchedule([stall], Date.parse('2027-02-21T22:59:59Z'));
  assert.equal(before.started, false);
  const after = getEventSchedule([stall], Date.parse('2027-02-22T01:00:00Z'));
  assert.equal(after.started, true);
  assert.equal(after.liveNow, false);
  assert.equal(after.next, stall);
  assert.deepEqual(getEventSchedule([stall], Date.parse('2027-02-23T00:00:00+11:00')).past, [stall]);
});

test('shows ongoing events only during their actual scheduled window', () => {
  const during = getEventSchedule([pastWorkshop], Date.parse('2026-07-17T18:00:00+10:00'));
  assert.equal(during.liveNow, true);
  const ended = getEventSchedule([pastWorkshop], Date.parse(pastWorkshop.endIso));
  assert.equal(ended.next, undefined);
  assert.equal(ended.liveNow, false);
  assert.deepEqual(ended.past, [pastWorkshop]);
});
