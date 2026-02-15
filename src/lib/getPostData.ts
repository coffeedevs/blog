import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Transforms an image path to use size-specific folders
 * Example: /content/images/2018/09/image.jpg -> /content/images/size/w2000/2018/09/image.jpg
 * @param imagePath - The original image path from MDX frontmatter
 * @param width - The desired width (default: 2000 for hero images)
 * @returns The transformed image path with size folder
 */
export function transformImagePath(imagePath: string, width: number = 2000): string {
  if (!imagePath) return imagePath;

  // Check if the path already contains /size/w{number}/
  if (/\/size\/w\d+\//.test(imagePath)) {
    return imagePath;
  }

  // Match pattern: /content/images/{year}/{month}/{filename}
  const match = imagePath.match(/^(\/content\/images\/)(.+)$/);

  if (match) {
    const [, basePath, restPath] = match;
    return `${basePath}size/w${width}/${restPath}`;
  }

  // Return original path if pattern doesn't match
  return imagePath;
}

export interface Author {
  name: string;
  slug: string;
  twitter?: string;
  website?: string;
  avatar: string;
  bio?: string;
}

export interface PostData {
  title: string;
  featureImage: string;
  articleMdx: string;
  slug: string;
  date: string;
  excerpt: string;
  author: Author;
}

export interface TagInfo {
  name: string;
  slug: string;
}

export interface PostMeta {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  author: {
    name: string;
    slug: string;
  };
  featureImage?: string;
  featured?: boolean;
  readingTime?: number;
  tags?: string[];
}

function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateForDescription(value: string, maxLength: number = 160): string {
  if (value.length <= maxLength) {
    return value;
  }

  const truncated = value.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  if (lastSpaceIndex < 120) {
    return `${truncated.trim()}…`;
  }

  return `${truncated.slice(0, lastSpaceIndex).trim()}…`;
}

function buildSeoDescription(excerpt: string, content: string): string {
  const normalizedExcerpt = excerpt.trim();
  if (normalizedExcerpt.length >= 40) {
    return truncateForDescription(normalizedExcerpt);
  }

  const fallback = stripMarkdown(content);
  if (fallback.length > 0) {
    return truncateForDescription(fallback);
  }

  return "Tutoriales, guías y experiencias sobre desarrollo de Software.";
}

export async function getPostData(slug: string[]): Promise<PostData | null> {
  const postSlug = slug.join("/");
  const filePath = path.join(process.cwd(), "content", "posts", `${postSlug}.mdx`);

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // Extract author data from frontmatter
    const normalizedAuthorSlug = data.author?.slug || "facundo";
    const author: Author = {
      name: data.author?.name || "Facundo Goñi",
      slug: normalizedAuthorSlug,
      twitter: data.author?.twitter || "@facundofarias",
      website: data.author?.website || "https://facundofarias.com.ar",
      avatar: transformImagePath(data.author?.avatar || "/content/images/2018/06/facundo.jpg", 100),
      bio: data.author?.bio || "Full-stack developer y apasionado por Laravel",
    };

    return {
      title: data.title || "",
      featureImage: transformImagePath(data.featureImage || "", 2000),
      articleMdx: content,
      slug: data.slug || postSlug,
      date: data.date || "",
      excerpt: buildSeoDescription(data.excerpt || "", content),
      author,
    };
  } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error(`Error reading or parsing post data for slug: ${postSlug}`, e);
    return null;
  }
}

/**
 * Calculate reading time in minutes based on word count
 * Average reading speed: 200 words per minute
 * @param content - The full content of the post
 * @returns Reading time in minutes
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

export async function getAllPosts(options?: { query?: string }): Promise<PostMeta[]> {
  const postsDirectory = path.join(process.cwd(), "content", "posts");
  const normalizedQuery = options?.query?.trim().toLowerCase();

  try {
    const filenames = await fs.readdir(postsDirectory);
    const posts = await Promise.all(
      filenames
        .filter(name => name.endsWith('.mdx'))
        .map(async (name): Promise<PostMeta | null> => {
          const filePath = path.join(postsDirectory, name);
          const fileContent = await fs.readFile(filePath, "utf-8");
          const { data, content } = matter(fileContent);

          if (normalizedQuery) {
            const searchableText = `${data.title || ""} ${content}`.toLowerCase();
            if (!searchableText.includes(normalizedQuery)) {
              return null;
            }
          }

          return {
            title: data.title || "",
            slug: data.slug || name.replace(/\.mdx$/, ""),
            date: data.date || "",
            excerpt: data.excerpt || "",
            author: {
              name: data.author?.name || "Facundo Goñi",
              slug: data.author?.slug || "facundo",
            },
            featureImage: data.featureImage || "",
            featured: data.featured || false,
            readingTime: calculateReadingTime(content),
            tags: Array.isArray(data.tags) ? data.tags : undefined,
          };
        })
    );

    const filteredPosts = posts.filter((post): post is PostMeta => post !== null);

    // Sort posts by date (newest first)
    return filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error("Error reading posts directory", e);
    return [];
  }
}

export async function getAllTags(): Promise<TagInfo[]> {
  const tagsPath = path.join(process.cwd(), "content", "tags.json");
  const tagsContent = await fs.readFile(tagsPath, "utf-8");
  return JSON.parse(tagsContent);
}

export async function getPostsByTag(tagSlug: string): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags?.includes(tagSlug));
}
