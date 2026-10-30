export const BLOG_POSTS_PER_PAGE = 12;
const LEGACY_POSTS_PER_PAGE = 6;

export function getBlogPageCount(totalPosts: number): number {
  return Math.max(1, Math.ceil(Math.max(0, totalPosts - 1) / BLOG_POSTS_PER_PAGE));
}

export function getBlogPageUrl(pageIndex: number): string {
  if (!Number.isSafeInteger(pageIndex) || pageIndex < 0) {
    throw new Error('Blog page index must be a non-negative integer.');
  }
  return pageIndex === 0 ? '/blog/' : `/blog/page/${pageIndex + 1}/`;
}

export function getLegacyBlogPages(totalPosts: number) {
  const count = Math.max(1, Math.ceil(totalPosts / LEGACY_POSTS_PER_PAGE));
  return Array.from({ length: count }, (_, index) => {
    const middlePost = Math.min(Math.max(0, totalPosts - 1), index * LEGACY_POSTS_PER_PAGE + LEGACY_POSTS_PER_PAGE / 2);
    const pageIndex = Math.floor(Math.max(0, middlePost - 1) / BLOG_POSTS_PER_PAGE);
    return { slug: String(index + 1), redirect: getBlogPageUrl(pageIndex) };
  });
}
