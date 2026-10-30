import test from 'node:test';
import assert from 'node:assert/strict';

test('shares one Discord request between concurrent pages and later calls', async t => {
  let resolveResponse;
  const response = new Promise(resolve => { resolveResponse = resolve; });
  const fetchMock = t.mock.method(globalThis, 'fetch', () => response);
  const { getDiscordMemberCount } = await import('../src/lib/discord-members.js?success');

  const pending = [getDiscordMemberCount(), getDiscordMemberCount(), getDiscordMemberCount()];
  assert.equal(fetchMock.mock.callCount(), 1);
  assert.equal(fetchMock.mock.calls[0].arguments[0], 'https://discord.com/api/v9/invites/duca?with_counts=true');
  assert.ok(fetchMock.mock.calls[0].arguments[1].signal instanceof AbortSignal);

  resolveResponse({ ok: true, json: async () => ({ approximate_member_count: 1234 }) });
  assert.deepEqual(await Promise.all(pending), [1234, 1234, 1234]);
  assert.equal(await getDiscordMemberCount(), 1234);
  assert.equal(fetchMock.mock.callCount(), 1);
});

test('caches the fallback for missing or invalid member counts without retrying', async t => {
  const invalidCounts = [undefined, null, '1234', 0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1];
  for (const [index, count] of invalidCounts.entries()) {
    await t.test(`invalid count ${String(count)}`, async subtest => {
      const fetchMock = subtest.mock.method(globalThis, 'fetch', async () => ({
        ok: true,
        json: async () => ({ approximate_member_count: count }),
      }));
      const { getDiscordMemberCount, DEFAULT_DISCORD_MEMBER_COUNT } = await import(`../src/lib/discord-members.js?invalid-${index}`);

      assert.equal(await getDiscordMemberCount(), DEFAULT_DISCORD_MEMBER_COUNT);
      assert.equal(await getDiscordMemberCount(), DEFAULT_DISCORD_MEMBER_COUNT);
      assert.equal(fetchMock.mock.callCount(), 1);
    });
  }
});

test('caches the fallback on an unsuccessful HTTP response without retrying', async t => {
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 429 }));
  const { getDiscordMemberCount, DEFAULT_DISCORD_MEMBER_COUNT } = await import('../src/lib/discord-members.js?http-error');

  assert.deepEqual(await Promise.all([getDiscordMemberCount(), getDiscordMemberCount()]), [DEFAULT_DISCORD_MEMBER_COUNT, DEFAULT_DISCORD_MEMBER_COUNT]);
  assert.equal(await getDiscordMemberCount(), DEFAULT_DISCORD_MEMBER_COUNT);
  assert.equal(fetchMock.mock.callCount(), 1);
});

test('caches the fallback after a network failure or timeout without retrying', async t => {
  for (const [index, error] of [new Error('Connection failed'), new DOMException('Timed out', 'TimeoutError')].entries()) {
    await t.test(error.name, async subtest => {
      const fetchMock = subtest.mock.method(globalThis, 'fetch', async () => { throw error; });
      const { getDiscordMemberCount, DEFAULT_DISCORD_MEMBER_COUNT } = await import(`../src/lib/discord-members.js?network-error-${index}`);

      assert.deepEqual(await Promise.all([getDiscordMemberCount(), getDiscordMemberCount()]), [DEFAULT_DISCORD_MEMBER_COUNT, DEFAULT_DISCORD_MEMBER_COUNT]);
      assert.equal(await getDiscordMemberCount(), DEFAULT_DISCORD_MEMBER_COUNT);
      assert.equal(fetchMock.mock.callCount(), 1);
    });
  }
});

test('caches the fallback when Discord returns invalid JSON without retrying', async t => {
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => ({
    ok: true,
    json: async () => { throw new SyntaxError('Invalid JSON'); },
  }));
  const { getDiscordMemberCount, DEFAULT_DISCORD_MEMBER_COUNT } = await import('../src/lib/discord-members.js?invalid-json');

  assert.equal(await getDiscordMemberCount(), DEFAULT_DISCORD_MEMBER_COUNT);
  assert.equal(await getDiscordMemberCount(), DEFAULT_DISCORD_MEMBER_COUNT);
  assert.equal(fetchMock.mock.callCount(), 1);
});
