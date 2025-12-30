# Documentation - Blog Posts

This documentation explains how to manage blog posts on this Astro site.

## How to Add a New Blog Post

All blog posts are stored in the `src/content/blog` directory. Each post should have its own folder, following this naming convention:

```
yyyy-mm-dd-title-goes-here
```

- `yyyy-mm-dd` is the publication date.
- `title-goes-here` is a lowercase, dash-separated version of your post title. Avoid special characters in both the folder name and the title.

For example, for a post titled **“A Student-Centric Perspective on BSides Melbourne”** published on `2024-12-19`, create:

```
src/content/blog/2024-12-19-a-student-centric-perspective-on-bsides-melbourne/
```

Inside this folder, create an `index.md` file. This file contains all the content of your blog post and starts with a **frontmatter** section. The frontmatter contains metadata about the post, which Astro uses for display, organization, and social media previews. It is not part of the main content.

Here is an example frontmatter:

```yml
---
title: A Student-Centric Perspective on BSides Melbourne
author: paige-haines
description: DUCA reflects on attending BSides Melbourne, highlighting student-focused talks, networking opportunities, and valuable industry insights.
publishDate: 2024-12-19
tags: ["Conferences", "BSides"]
featuredImage: ./image.png
slug: 2024-12-19-a-student-centric-perspective-on-bsides-melbourne
---

Content starts here....
```

**Frontmatter Field Guidelines:**

- `title` – The full post title.
- `author` – The post’s author. Set up the author properly in [Authors Documentation](./authors.md).
- `description` – A brief summary (20–30 words) displayed under the title and in social media previews.
- `publishDate` – The post’s publication date in `YYYY-MM-DD` format.
- `tags` – Keywords for categorization. Reuse existing tags when possible for consistency.
- `featuredImage` – The hero image displayed at the top of the post, in cards, and in link previews.
- `slug` – Must exactly match the folder name; mismatched slugs can break blog links.

After the frontmatter, write the main content of your post in Markdown, following **GitHub Flavored Markdown (GFM)**. [Learn more about GFM](https://github.github.com/gfm/). Place all images in the same folder as `index.md` to simplify management. If using VSCode, you can paste images directly from the clipboard into this folder.

For new posts, you can start with this template:

```yml
---
title: TITLE
author: AUTHOR
description: DESCRIPTION
publishDate: YYYY-MM-DD
tags: ["TAG1", "TAG2"]
featuredImage: ./image.png
slug: SLUG
---

CONTENT
```

Replace all fields with the appropriate values and write your content below the second `---`.

Before pushing your post, start the development server to preview it. Ensure that images display correctly, formatting appears as expected, and the site builds without errors. This step ensures your post will work correctly when published and maintains the integrity of the site’s CI/CD pipeline.
