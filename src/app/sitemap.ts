import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/getPostData";

const SITE_URL = "https://blog.coffeedevs.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${SITE_URL}/tag/${tag.slug}/`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...postEntries,
    ...tagEntries,
  ];
}
