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

    try {
      const response = await fetch(DISCORD_INVITE_API);
      if (response.ok) {
        const data = await response.json();
        memberCount = data.approximate_member_count || DEFAULT_DISCORD_MEMBER_COUNT;
      }
    } catch {
      // Fall back to default member count.
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
