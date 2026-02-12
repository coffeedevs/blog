import Header from "@/components/Header";
import ArticleGrid from "@/components/ArticleGrid";
import Footer from "@/components/Footer";
import { PostMeta, transformImagePath } from "@/lib/getPostData";

interface TagPageProps {
  tagName: string;
  posts: PostMeta[];
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
      name: "Facundo Goñi",
      profile_image: "/content/images/size/w100/2020/07/JhjFSCA5_400x400.jpg",
      slug: "facundo"
    },
    primary_tag: post.tags?.[0] ? { name: post.tags[0], slug: post.tags[0] } : null,
    published_at: new Date(post.date).toISOString(),
    reading_time: post.readingTime || 1,
    featured: post.featured || false
  }));
}

export default function TagPage({ tagName, posts }: TagPageProps) {
  const transformedPosts = transformPostsForGrid(posts);

  return (
    <>
      <Header />
      <main className="main-wrap">
        <div className="l-content">
          <div className="l-wrapper">
            <div style={{ textAlign: "center", padding: "3rem 0 1rem" }}>
              <h1 style={{ fontSize: "2.5rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--titles-color)" }}>{tagName}</h1>
              <p style={{ color: "var(--titles-color)", opacity: 0.7 }}>{posts.length === 1 ? "1 artículo" : `${posts.length} artículos`}</p>
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
