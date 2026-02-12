import Image from 'next/image';
import Link from 'next/link';
import { getAllPosts, PostMeta, transformImagePath } from '@/lib/getPostData';

interface RecommendedPostsProps {
  currentSlug: string;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMonths = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));

  if (diffInMonths === 0) return "hace menos de un mes";
  if (diffInMonths < 12) return `hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;

  const years = Math.floor(diffInMonths / 12);
  return `hace ${years} ${years === 1 ? 'año' : 'años'}`;
}

export default async function RecommendedPosts({ currentSlug }: RecommendedPostsProps) {
  const allPosts = await getAllPosts();

  // Get 3 random posts that are not the current post
  const otherPosts = allPosts.filter(post => post.slug !== currentSlug);
  const randomPosts = otherPosts
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  if (randomPosts.length === 0) {
    return null;
  }

  return (
    <section className="m-recommended">
      <div className="l-wrapper in-recommended">
        <h3 className="m-section-title in-recommended">Recomendado para ti</h3>
        <div className="m-recommended-articles">
          <div className="l-grid l-grid--3">
            {randomPosts.map((post) => {
              const readingTime = Math.ceil((post.excerpt?.split(' ').length || 0) / 200);

              return (
                <article key={post.slug} className={`m-article-card post ${post.featured ? 'featured' : ''}`}>
                  <div className="m-article-card__picture">
                    <Link href={`/${post.slug}/`} className="m-article-card__picture-link" aria-hidden="true" tabIndex={-1}></Link>
                    <Image
                      className="m-article-card__picture-background"
                      src={transformImagePath(post.featureImage || '/content/images/2018/06/background.jpg', 1000)}
                      loading="lazy"
                      alt=""
                      width={600}
                      height={400}
                    />

                    <Link
                      href={`/author/facundo/`}
                      className="m-article-card__author js-tooltip"
                      aria-label="Facundo Goñi"
                      data-tippy-content="Publicado por Facundo Goñi"
                    >
                      <div style={{ backgroundImage: `url(/content/images/size/w100/2020/07/JhjFSCA5_400x400.jpg)` }}></div>
                    </Link>

                    {post.featured && (
                      <Link href={`/${post.slug}/`} className="m-article-card__featured js-tooltip" data-tippy-content="Destacado" aria-label="Destacado">
                        <span className="icon-star" aria-hidden="true"></span>
                      </Link>
                    )}
                  </div>

                  <div className="m-article-card__info no-tag">
                    <Link href={`/${post.slug}/`} className="m-article-card__info-link" aria-label={post.title}>
                      <div>
                        <h2 className="m-article-card__title js-article-card-title" title={post.title}>
                          {post.title}
                        </h2>
                      </div>
                      <div className="m-article-card__timestamp">
                        <span>{formatTimeAgo(post.date)}</span>
                        <span>&bull;</span>
                        <span>{readingTime} min de lectura</span>
                      </div>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
