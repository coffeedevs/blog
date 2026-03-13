import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import '../app/share-buttons.css';
import '../app/post-hero.css';

interface PostLayoutProps {
  children: React.ReactNode;
  title: string;
  featureImage: string;
  slug: string;
}

export default function PostLayout({ children, title, featureImage, slug }: PostLayoutProps) {
  return (
    <>
      <Header />
      <main className="main-wrap">
        <section className="post-hero">
          <div className="post-hero__picture">
            <Image
              src={featureImage}
              alt={title}
              width={2000}
              height={1280}
              sizes="100vw"
              fetchPriority="high"
              priority
            />
          </div>
          <div className="l-wrapper in-post">
            <div className="post-hero__title">
              <h1>{title}</h1>
            </div>
          </div>
        </section>
        <article>
          <ShareButtons title={title} slug={slug} />
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
