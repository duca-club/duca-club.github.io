import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { createServer } from 'vite';

// Use the same TS module loader as Astro without requiring native TS support
// from every Node version supported by the project.
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false, watch: null },
});
after(() => server.close());
const { people, getPerson } = await server.ssrLoadModule('/src/data/people.ts');
const { teamRosters, teamYears, latestTeamYear, executives, divisions } = await server.ssrLoadModule('/src/data/team.ts');
const { getAuthor } = await server.ssrLoadModule('/src/data/authors.ts');

test('team rosters reference existing shared profiles with local portraits', async () => {
  const activeIds = new Set();
  for (const roster of Object.values(teamRosters)) {
    const assignments = [...roster.executives, ...roster.divisions.flatMap(division => division.members)];
    for (const assignment of assignments) {
      assert.ok(Object.hasOwn(people, assignment.personId), assignment.personId);
      assert.ok(assignment.role.trim(), assignment.personId);
      activeIds.add(assignment.personId);
    }
  }
  for (const id of activeIds) {
    const person = getPerson(id);
    assert.ok(person.name.trim(), id);
    assert.ok(person.image.startsWith('/'), id);
    await access(new URL(`../public${person.image}`, import.meta.url));
  }
  assert.deepEqual(teamYears, Object.keys(teamRosters).map(Number).sort((a, b) => a - b));
  assert.equal(latestTeamYear, Math.max(...teamYears));
});

test('author links follow stable person IDs even when display names differ', () => {
  const records = {
    writer: {
      personId: 'paige-haines',
      name: 'A different byline',
      image: '/authors/paige-haines.png',
      bio: 'Author-specific biography.',
    },
  };
  assert.deepEqual(getAuthor('writer', records), {
    name: 'A different byline',
    image: '/authors/paige-haines.png',
    bio: 'Author-specific biography.',
    link: people['paige-haines'].linkedIn,
  });
  records.writer.link = 'https://example.com/writer';
  assert.equal(getAuthor('writer', records).link, records.writer.link);
});

test('shared staff biographies follow both executive and committee assignments', () => {
  const profile = people['hirusha-adikari'];
  assert.equal(executives['2026'].find(member => member.name === profile.name).bio, profile.bio);
  const committeeMember = divisions['2026'].flatMap(division => division.members)
    .find(member => member.name === profile.name);
  assert.equal(committeeMember.bio, profile.bio);
});

test('guest authors work without a team profile and staff authors inherit their name', () => {
  const guest = { name: 'Guest Writer', image: '/authors/guest.png', bio: 'Guest biography.' };
  assert.deepEqual(getAuthor('guest', { guest }), guest);
  assert.equal(getAuthor('paige-haines').name, people['paige-haines'].name);
});

test('unknown author and person references fail with actionable errors', () => {
  assert.throws(() => getAuthor('missing', {}), /Unknown author "missing".*authors\.json/);
  assert.throws(() => getAuthor('writer', { writer: { personId: 'missing' } }), /Unknown person "missing".*people\.ts/);
  assert.throws(() => getAuthor('guest', { guest: { bio: 'Incomplete record.' } }), /needs a name and image/);
});
