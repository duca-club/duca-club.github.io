import authorRecords from './authors.json';
import { getPerson } from './people';

export interface AuthorRecord {
  // Link a staff profile by its stable ID, or supply a standalone guest author.
  personId?: string;
  name?: string;
  image?: string;
  bio?: string;
  link?: string;
}

export interface BlogAuthor {
  name: string;
  image: string;
  bio: string;
  link?: string;
}

export const authors: Record<string, AuthorRecord> = authorRecords;

export function hasAuthor(authorId: string): boolean {
  return Object.hasOwn(authors, authorId);
}

export function getAuthor(
  authorId: string,
  records: Record<string, AuthorRecord> = authors,
): BlogAuthor {
  if (!Object.hasOwn(records, authorId)) {
    throw new Error(`Unknown author "${authorId}". Add the author to src/data/authors.json first.`);
  }
  const record = records[authorId];
  const person = record.personId ? getPerson(record.personId) : undefined;
  const name = record.name ?? person?.name;
  const image = record.image ?? person?.image;
  if (!name?.trim() || !image?.trim()) {
    throw new Error(`Author "${authorId}" needs a name and image, either directly or through personId.`);
  }
  const link = record.link ?? person?.linkedIn;
  return {
    name,
    image,
    bio: record.bio ?? person?.bio ?? '',
    ...(link && link !== '#' ? { link } : {}),
  };
}

// Catch incomplete author records or broken person references during the build.
Object.keys(authors).forEach(authorId => getAuthor(authorId));
