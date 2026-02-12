import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostData, getAllPosts, getAllTags, getPostsByTag, transformImagePath } from "@/lib/getPostData";
import PostLayout from "@/components/PostLayout";
import PostArticle from "@/components/PostArticle";
import TagPage from "@/components/TagPage";

const SITE_URL = "https://blog.coffeedevs.com";

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const params = await props.params;

  // Tag pages
  if (params.slug[0] === "tag" && params.slug.length === 2) {
    const tagSlug = params.slug[1];
    const tags = await getAllTags();
    const tag = tags.find((t) => t.slug === tagSlug);
    if (!tag) return {};

    const posts = await getPostsByTag(tagSlug);
    const title = `${tag.name} - Café de por medio`;
    const description = `Artículos sobre ${tag.name}. ${posts.length} ${posts.length === 1 ? "publicación" : "publicaciones"} en Café de por medio.`;

    return {
      title,
      description,
      alternates: { canonical: `${SITE_URL}/tag/${tag.slug}/` },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/tag/${tag.slug}/`,
        type: "website",
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
    };
  }

  // Post pages
  const postData = await getPostData(params.slug);
  if (!postData) return {};

  const title = `${postData.title} - Café de por medio`;
  const description = postData.excerpt;
  const ogImage = postData.featureImage
    ? `${SITE_URL}${transformImagePath(postData.featureImage, 2000)}`
    : `${SITE_URL}/content/images/2018/06/background.jpg`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${postData.slug}/` },
    openGraph: {
      title: postData.title,
      description,
      url: `${SITE_URL}/${postData.slug}/`,
      type: "article",
      publishedTime: postData.date,
      authors: [postData.author.name],
      images: [{ url: ogImage, width: 2000, height: 1280 }],
    },
    twitter: {
      card: "summary_large_image",
      title: postData.title,
      description,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  const postParams = posts.map((post) => ({
    slug: [post.slug],
  }));

  const tagParams = tags.map((tag) => ({
    slug: ["tag", tag.slug],
  }));

  return [...postParams, ...tagParams];
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;

  // Handle /tag/{slug} routes
  if (params.slug[0] === "tag" && params.slug.length === 2) {
    const tagSlug = params.slug[1];
    const tags = await getAllTags();
    const tag = tags.find((t) => t.slug === tagSlug);

    if (!tag) {
      notFound();
    }

    const posts = await getPostsByTag(tagSlug);
    return <TagPage tagName={tag.name} posts={posts} />;
  }

  const postData = await getPostData(params.slug);

  if (!postData) {
    notFound();
  }

  return (
    <PostLayout title={postData.title} featureImage={postData.featureImage} slug={postData.slug}>
      <PostArticle
        articleMdx={postData.articleMdx}
        title={postData.title}
        slug={postData.slug}
        author={postData.author}
      />
    </PostLayout>
  );
}