export const DISCORD_INVITE_CODE = "duca";
export const DEFAULT_DISCORD_MEMBER_COUNT = 850;

const DISCORD_INVITE_API = `https://discord.com/api/v9/invites/${DISCORD_INVITE_CODE}?with_counts=true`;
let cachedMemberCount: number | null = null;
let memberCountPromise: Promise<number> | null = null;

export async function getDiscordMemberCount() {
  if (cachedMemberCount !== null) {
    return cachedMemberCount;
  }

  if (memberCountPromise) {
    return memberCountPromise;
  }

  memberCountPromise = (async () => {
    let memberCount = DEFAULT_DISCORD_MEMBER_COUNT;
    const fetchCount = async () => {
      const response = await fetch(DISCORD_INVITE_API);
      if (!response.ok) {
        throw new Error(`Discord invite API request failed with status ${response.status}`);
      }
      const data = await response.json();
      return data.approximate_member_count || DEFAULT_DISCORD_MEMBER_COUNT;
    };

    try {
      memberCount = await fetchCount();
    } catch {
      // Retry once before falling back to default.
      try {
        memberCount = await fetchCount();
      } catch {
        // Fall back to default member count.
      }
    }

    cachedMemberCount = memberCount;
    memberCountPromise = null;
    return memberCount;
  })();

  return memberCountPromise;
}

export function formatMemberCount(memberCount: number) {
  return new Intl.NumberFormat("en-US").format(memberCount);
}
