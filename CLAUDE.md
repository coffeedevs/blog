# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Spanish-language tech blog ("Café de por medio") at blog.coffeedevs.com, built with Next.js 15 App Router. Content is authored in MDX files with YAML frontmatter. The site features syntax-highlighted code blocks, a featured post slider, Disqus comments, and dark mode.

## Commands

```bash
npm run dev          # Dev server with Turbopack (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm test             # Jest - validates all MDX frontmatter and content structure
npm run test:watch   # Jest watch mode
```

Node version: 24.1.0 (see .nvmrc)

## Architecture

### Content Pipeline

MDX files in `content/posts/` → `gray-matter` extracts frontmatter → `@mdx-js/mdx` compiles content → `rehype-prism-plus` adds syntax highlighting → rendered via React Server Components.

Key content functions in `src/lib/getPostData.ts`:
- `getAllPosts()` — returns all post metadata sorted by date (newest first), with calculated reading time (200 wpm)
- `getPostData(slug)` — returns single post with compiled MDX

Authors defined in `content/authors.json`. Tags defined in `content/tags.json`.

### Routing

App Router with a catch-all route `src/app/[...slug]/page.tsx` for individual posts. Uses `generateStaticParams()` for static generation of all post pages at build time.

### MDX Frontmatter Schema

Required fields: `title`, `slug`, `date` (YYYY-MM-DD), `featureImage`, `excerpt`, `author` (with `name`, `slug`, `avatar`). Optional: `featured` (boolean), `tags` (string array), author `twitter`/`website`.

### Custom MDX Components

`Slideshare` — embedded presentations. Available automatically in all MDX content. Adding new custom components requires registering them in `MDXContent`.

### Image Handling

`transformImagePath()` in `src/lib/getPostData.ts` converts image paths to sized versions: `/content/images/2018/09/img.jpg` → `/content/images/size/w2000/2018/09/img.jpg`. Static images served from `public/content/images/`.

### Key Components

- `FeaturedSlider` — client-side carousel for posts with `featured: true`
- `MDXContent` — compiles and renders MDX with Prism syntax highlighting (Okaidia theme)
- `PostArticle` — full post view: MDX content + author widget + Disqus + recommended posts
- `ShareButtons` — share links + scroll-to-top with SVG progress ring
- `DisqusComments` — comment integration (shortname: "cafedepormedio")

### Testing

The test suite in `__tests__/mdx-smoke.test.ts` validates all MDX files for: required frontmatter fields, date format, non-empty content, balanced JSX tags, valid author structure, valid image paths, allowed custom components (only `Slideshare`), and proper code block formatting (PHP blocks must contain `<?php`).

## Adding a New Post

Create an MDX file in `content/posts/` following the frontmatter schema above. The slug in frontmatter determines the URL. Run `npm test` to validate the file structure.
