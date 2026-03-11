export const DISCORD_INVITE_CODE = "duca";
export const DEFAULT_DISCORD_MEMBER_COUNT = 750;

const DISCORD_INVITE_API = `https://discord.com/api/v9/invites/${DISCORD_INVITE_CODE}?with_counts=true`;

export async function getDiscordMemberCount() {
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

  return memberCount;
}

export function formatMemberCount(memberCount: number) {
  return new Intl.NumberFormat("en-US").format(memberCount);
}
