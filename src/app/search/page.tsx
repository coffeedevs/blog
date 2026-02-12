import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ArticleGrid from "@/components/ArticleGrid";
import Footer from "@/components/Footer";
import { getAllPosts, PostMeta, transformImagePath } from "@/lib/getPostData";

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export const metadata: Metadata = {
  title: "Buscar - Café de por medio",
  robots: {
    index: false,
    follow: true,
  },
};

function transformPostsForComponents(posts: PostMeta[]) {
  return posts.map((post) => ({
    id: post.slug,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    feature_image: transformImagePath(post.featureImage || "/content/images/2018/06/background.jpg", 1000),
    feature_image_mobile: transformImagePath(post.featureImage || "/content/images/2018/06/background.jpg", 600),
    author: {
      name: "Facundo Goñi",
      profile_image: "/content/images/size/w100/2020/07/JhjFSCA5_400x400.jpg",
      slug: "facundo",
    },
    primary_tag: post.tags?.[0] ? { name: post.tags[0], slug: post.tags[0] } : null,
    published_at: new Date(post.date).toISOString(),
    reading_time: post.readingTime || 1,
    featured: post.featured || false,
  }));
}

export default async function SearchPage(props: SearchPageProps) {
  if (process.env.NODE_ENV === "development") {
    noStore();
  }

  const searchParams = await props.searchParams;
  const rawQuery = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q;
  const query = rawQuery?.trim() || "";
  const posts = query ? await getAllPosts({ query }) : [];
  const transformedPosts = transformPostsForComponents(posts);

  return (
    <>
      <Header searchQuery={query} />
      <main className="main-wrap">
        <Hero />
        <div className="l-content">
          <div className="l-wrapper">
            <h2 className="m-section-title">
              Resultados para &quot;{query}&quot; ({transformedPosts.length})
            </h2>
            <div className="l-grid centered">
              {transformedPosts.length > 0 ? (
                <ArticleGrid articles={transformedPosts} />
              ) : (
                <p className="m-not-found align-center">
                  No encontramos artículos que coincidan con tu búsqueda.
                </p>
              )}
            </div>
          </div>
          <div className="l-wrapper">
            <nav className="m-pagination" aria-label="Paginación">
              <span className="m-pagination__text">{transformedPosts.length} resultado(s)</span>
            </nav>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
