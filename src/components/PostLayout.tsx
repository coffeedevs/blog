import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ShareButtons from "@/components/ShareButtons";
import '../app/share-buttons.css';

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
        <Hero title={title} featureImage={featureImage} showContent description={null} />
        <article>
          <ShareButtons title={title} slug={slug} />
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
