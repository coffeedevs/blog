import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import Header from "@/components/Header";
import ArticleGrid from "@/components/ArticleGrid";
import Footer from "@/components/Footer";
import { getAllPosts, PostMeta, transformImagePath } from "@/lib/getPostData";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = "https://blog.coffeedevs.com";
const CANONICAL_AUTHOR_SLUG = "facundo";
const AUTHOR_ALIASES = new Set(["facundo", "facundo-goni"]);

function normalizeSlug(value: string): string {
  return decodeURIComponent(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function transformPostsForGrid(posts: PostMeta[]) {
  return posts.map((post) => ({
    id: post.slug,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    feature_image: transformImagePath(post.featureImage || "/content/images/2018/06/background.jpg", 1000),
    feature_image_mobile: transformImagePath(post.featureImage || "/content/images/2018/06/background.jpg", 600),
    author: {
      name: post.author.name || "Facundo Goñi",
      profile_image: "/content/images/size/w100/2020/07/JhjFSCA5_400x400.jpg",
      slug: CANONICAL_AUTHOR_SLUG,
    },
    primary_tag: post.tags?.[0] ? { name: post.tags[0], slug: post.tags[0] } : null,
    published_at: new Date(post.date).toISOString(),
    reading_time: post.readingTime || 1,
    featured: post.featured || false,
  }));
}

export async function generateMetadata(props: AuthorPageProps): Promise<Metadata> {
  if (process.env.NODE_ENV === "development") {
    noStore();
  }

  const params = await props.params;
  const normalized = normalizeSlug(params.slug);

  if (!AUTHOR_ALIASES.has(normalized)) {
    return {};
  }

  const title = "Facundo Goñi - Autor | Café de por medio";
  const description = "Artículos de Facundo Goñi sobre Laravel, desarrollo web, performance y más.";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/author/${CANONICAL_AUTHOR_SLUG}/`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/author/${CANONICAL_AUTHOR_SLUG}/`,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function generateStaticParams() {
  return [{ slug: CANONICAL_AUTHOR_SLUG }, { slug: "facundo-goni" }];
}

export default async function AuthorPage(props: AuthorPageProps) {
  if (process.env.NODE_ENV === "development") {
    noStore();
  }

  const params = await props.params;
  const normalized = normalizeSlug(params.slug);

  if (!AUTHOR_ALIASES.has(normalized)) {
    notFound();
  }

  if (normalized !== CANONICAL_AUTHOR_SLUG) {
    permanentRedirect(`/author/${CANONICAL_AUTHOR_SLUG}/`);
  }

  const posts = await getAllPosts();
  const authorPosts = posts.filter((post) => {
    const authorSlug = normalizeSlug(post.author.slug || "");
    const authorName = normalizeSlug(post.author.name || "");
    return authorSlug === CANONICAL_AUTHOR_SLUG || authorName.includes(CANONICAL_AUTHOR_SLUG);
  });
  const transformedPosts = transformPostsForGrid(authorPosts);

  return (
    <>
      <Header />
      <main className="main-wrap">
        <div className="l-content">
          <div className="l-wrapper">
            <div style={{ textAlign: "center", padding: "3rem 0 1rem" }}>
              <h1 style={{ fontSize: "2.5rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--titles-color)" }}>
                Facundo Goñi
              </h1>
              <p style={{ color: "var(--titles-color)", opacity: 0.7 }}>
                {authorPosts.length === 1 ? "1 artículo publicado" : `${authorPosts.length} artículos publicados`}
              </p>
            </div>
            <div className="l-grid centered">
              <ArticleGrid articles={transformedPosts} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
