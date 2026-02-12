"use client";

import Link from "next/link";
import { useState } from "react";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  feature_image: string;
  feature_image_mobile: string;
  author: {
    name: string;
    profile_image: string;
    slug: string;
  };
  primary_tag: {
    name: string;
    slug: string;
  } | null;
  published_at: string;
  reading_time: number;
  featured: boolean;
}

interface FeaturedSliderProps {
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

export default function FeaturedSlider({ articles }: FeaturedSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
  };

  if (articles.length === 0) return null;

  return (
    <div className="m-featured-slider glide js-featured-slider">
      <div className="glide__track" data-glide-el="track">
        <div className="m-featured-slider__list glide__slides">
          {articles.map((article, index) => (
            <div
              key={article.id}
              className="m-featured-slider__list__item glide__slide js-featured-slide"
              style={{
                display: index === currentSlide ? 'block' : 'none'
              }}
            >
              <article className="m-featured-article">
                <div className="m-featured-article__picture">
                  <style>
                    {`
                      #featured-bg-${article.id} {
                        background-image: url(${article.feature_image});
                      }
                      @media(max-width: 768px) {
                        #featured-bg-${article.id} {
                          background-image: url(${article.feature_image_mobile});
                        }
                      }
                    `}
                  </style>
                  <div id={`featured-bg-${article.id}`}></div>
                </div>

                <div className="m-featured-article__meta">
                  <Link
                    href={`/author/${article.author.slug}/`}
                    className="m-featured-article__author js-tooltip"
                    aria-label={article.author.name}
                    data-tippy-content={`Publicado por ${article.author.name}`}
                  >
                    <div style={{ backgroundImage: `url(${article.author.profile_image})` }}></div>
                  </Link>
                  {article.primary_tag && (
                    <Link href={`/tag/${article.primary_tag.slug}/`} className="m-featured-article__tag">
                      {article.primary_tag.name}
                    </Link>
                  )}
                </div>

                <div className="m-featured-article__ribbon">
                  <span className="icon-star"></span>
                  <span>Destacado</span>
                </div>

                <Link href={`/${article.slug}/`} className="m-featured-article__content">
                  <h2 className="m-featured-article__title js-featured-article-title" title={article.title}>
                    {article.title}
                  </h2>
                  <div className="m-featured-article__timestamp">
                    <span>{formatTimeAgo(article.published_at)}</span>
                    <span>&bull;</span>
                    <span>{article.reading_time} min de lectura</span>
                  </div>
                </Link>
              </article>
            </div>
          ))}
        </div>
      </div>

      {articles.length > 1 && (
        <div data-glide-el="controls" className="glide__arrows js-featured-slider-controls">
          <button
            onClick={goToPrevious}
            className="m-icon-button in-featured-articles glide-prev js-featured-slider-previous"
            aria-label="Anterior"
          >
            <span className="icon-arrow-left" aria-hidden="true"></span>
          </button>
          <button
            onClick={goToNext}
            className="m-icon-button in-featured-articles glide-next js-featured-slider-next"
            aria-label="Siguiente"
          >
            <span className="icon-arrow-right" aria-hidden="true"></span>
          </button>
        </div>
      )}
    </div>
  );
}
