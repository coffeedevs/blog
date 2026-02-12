
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedSlider from "@/components/FeaturedSlider";
import ArticleGrid from "@/components/ArticleGrid";
import Footer from "@/components/Footer";
import { getAllPosts, PostMeta, transformImagePath } from "@/lib/getPostData";

// Transform MDX post data to match component expectations
function transformPostsForComponents(posts: PostMeta[]) {
  return posts.map((post) => ({
    id: post.slug,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    feature_image: transformImagePath(post.featureImage || "/content/images/2018/06/background.jpg", 1000), // Use w1000 for article grid
    feature_image_mobile: transformImagePath(post.featureImage || "/content/images/2018/06/background.jpg", 600), // Use w600 for mobile
    author: {
      name: "Facundo Goñi",
      profile_image: "/content/images/size/w100/2020/07/JhjFSCA5_400x400.jpg",
      slug: "facundo"
    },
    primary_tag: { name: "desarrollo", slug: "desarrollo" },
    published_at: new Date(post.date).toISOString(),
    reading_time: post.readingTime || 1, // Use calculated reading time from full content
    featured: post.featured || false
  }));
}

export default async function Home() {
  const posts = await getAllPosts();
  const transformedPosts = transformPostsForComponents(posts);

  // Use first 2 posts as featured (they also appear in the article grid)
  const featuredArticles = transformedPosts.slice(0, 2);
  const recentArticles = transformedPosts; // Show all posts including featured ones

  return (
    <>
      <Header />
      <main className="main-wrap">
        <Hero />
        <div className="l-content">
          <div className="l-wrapper">
            <div className="l-grid centered">
              <FeaturedSlider articles={featuredArticles} />
              <ArticleGrid articles={recentArticles} />
            </div>
          </div>
          <div className="l-wrapper">
            <nav className="m-pagination" aria-label="Paginación">
              <span className="m-pagination__text">Página 1 de 1</span>
            </nav>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
