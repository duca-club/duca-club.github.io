import type { ReactNode } from 'react';
import '../styles/article.css';

export interface BlogArticleData {
  title: string;
  description: string;
  date: string;
  isoDate: string;
  slug: string;
  tags: string[];
  image?: string;
  author?: {
    name: string;
    image: string;
    bio: string;
    link?: string;
  };
}

export interface BlogArticleProps {
  article: BlogArticleData;
  children?: ReactNode;
}

function profileUrl(link: string | undefined): URL | undefined {
  if (!link) return undefined;
  try {
    const url = new URL(link);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : undefined;
  } catch {
    return undefined;
  }
}

export default function BlogArticle({ article, children }: BlogArticleProps) {
  const author = article.author;
  const authorUrl = profileUrl(author?.link);
  const authorLink = authorUrl?.href;
  const AuthorElement = authorLink ? 'a' : 'div';

  return (
    <article className="blog-article" data-anim="hero">
      <div className="article-topline">
        <a className="article-back" href="/blog/">‹ all posts</a>
        <span className="article-meta">
          {article.tags[0] && <>{article.tags[0]} · </>}
          <time dateTime={article.isoDate}>{article.date}</time>
        </span>
      </div>

      <h1 className="article-title">{article.title}</h1>
      <p className="article-description">{article.description}</p>
      <div className="article-rule" />

      {article.image && (
        <div className="article-lead-image">
          <img src={article.image} alt={article.title} fetchPriority="high" />
        </div>
      )}

      <div className="article-body">{children}</div>

      {author && (
        <div className="article-author">
          <div className="article-author-label">Written by</div>
          <AuthorElement
            className="article-author-row"
            {...(authorLink ? { href: authorLink, target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <img className="article-author-image" src={author.image} alt="" loading="lazy" />
            <span className="article-author-name">
              {author.name}
              {author.bio && <span className="article-author-bio"> · {author.bio}</span>}
            </span>
            {authorLink && (
              <span className="article-author-link">
                {authorUrl?.hostname.endsWith('linkedin.com') ? 'LinkedIn' : 'Website'} ↗
              </span>
            )}
          </AuthorElement>
        </div>
      )}

      <div className="article-tags">
        {article.tags.length > 0 && <span className="article-tag-label">Tagged</span>}
        {article.tags.map((tag) => (
          <a className="article-tag" href={`/blog/?tag=${encodeURIComponent(tag)}`} key={tag}>{tag}</a>
        ))}
        <a className="article-more" href="/blog/">more posts ↗</a>
      </div>
    </article>
  );
}
