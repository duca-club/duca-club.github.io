# Documentation - Authors

This documentation explains how to manage authors on this Astro site.

## How to Add a New Author

The JSON file `src/pages/blog/_authors.json` contains all information about authors.

```json
{
    "john-doe": {
        "name": "John Doe",
        "image": "/authors/john-doe.png",
        "bio": "I like tech"
    }
}
```

In the example above:

- The key `john-doe` uniquely identifies this author. Use this key when referring to an author in blog posts.
- Inside this object:
  - `name` is the properly formatted name of the author.
  - `image` is the author’s image, usually in the format `/authors/FILENAME.png`. Place the corresponding image file inside the `/public/authors` directory.
  - `bio` is a short description of the author. If someone else is adding this on behalf of the author, you may use the description from their LinkedIn profile.

For example, adding a new author should look like this:

```diff
{
    "john-doe": {
        "name": "John Doe",
        "image": "/authors/john-doe.png",
        "bio": "I like tech"
-    }
+    },
+    "hirusha-adikari": {
+        "name": "Hirusha Adikari",
+        "image": "/authors/hirusha-adikari.png",
+        "bio": "Cyber Security Student | OSINT Enjoyer | Breaker of Things"
+    }
}
```
