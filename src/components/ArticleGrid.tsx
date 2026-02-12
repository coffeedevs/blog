import Image from "next/image";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  feature_image: string;
  author: {
    name: string;
    profile_image: string;
  };
  primary_tag: {
    name: string;
    slug: string;
  } | null;
  published_at: string;
  reading_time: number;
  featured: boolean;
}

interface ArticleGridProps {
  articles: Article[];
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

export default function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <>
      {articles.map((article) => (
        <article key={article.id} className={`m-article-card post ${article.featured ? 'featured' : ''}`}>
          <div className="m-article-card__picture">
            <Link href={`/${article.slug}/`} className="m-article-card__picture-link" aria-hidden="true" tabIndex={-1}></Link>
            <Image 
              className="m-article-card__picture-background" 
              src={article.feature_image} 
              loading="lazy" 
              alt=""
              width={600}
              height={400}
            />
            
            <Link 
              href={`/author/${article.author.name.toLowerCase()}/`} 
              className="m-article-card__author js-tooltip" 
              aria-label={article.author.name} 
              data-tippy-content={`Publicado por ${article.author.name}`}
            >
              <div style={{ backgroundImage: `url(${article.author.profile_image})` }}></div>
            </Link>
            
            {article.featured && (
              <Link href={`/${article.slug}/`} className="m-article-card__featured js-tooltip" data-tippy-content="Destacado" aria-label="Destacado">
                <span className="icon-star" aria-hidden="true"></span>
              </Link>
            )}
          </div>
          
          <div className={`m-article-card__info ${!article.primary_tag ? 'no-tag' : ''}`}>
            {article.primary_tag && (
              <Link href={`/tag/${article.primary_tag.slug}/`} className="m-article-card__tag">
                {article.primary_tag.name}
              </Link>
            )}
            
            <Link href={`/${article.slug}/`} className="m-article-card__info-link" aria-label={article.title}>
              <div>
                <h2 className="m-article-card__title js-article-card-title" title={article.title}>
                  {article.title}
                </h2>
              </div>
              <div className="m-article-card__timestamp">
                <span>{formatTimeAgo(article.published_at)}</span>
                <span>&bull;</span>
                <span>{article.reading_time} min de lectura</span>
              </div>
            </Link>
          </div>
        </article>
      ))}
    </>
  );
}