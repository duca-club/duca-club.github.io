// Import only from Astro frontmatter: the count is fetched while generating pages.
export const DEFAULT_DISCORD_MEMBER_COUNT = 850;

const DISCORD_INVITE_API = 'https://discord.com/api/v9/invites/duca?with_counts=true';
let memberCountPromise;

export function getDiscordMemberCount() {
  // Keep the resolved promise too, including failures, so every page shares one request.
  memberCountPromise ??= (async () => {
    try {
      const response = await fetch(DISCORD_INVITE_API, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) return DEFAULT_DISCORD_MEMBER_COUNT;

      const data = await response.json();
      const count = data?.approximate_member_count;
      return Number.isSafeInteger(count) && count > 0 ? count : DEFAULT_DISCORD_MEMBER_COUNT;
    } catch {
      return DEFAULT_DISCORD_MEMBER_COUNT;
    }
  })();

  return memberCountPromise;
}
