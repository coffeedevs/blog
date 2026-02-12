import MDXContent from './MDXContent';
import AuthorWidget from './AuthorWidget';
import HireCTA from './HireCTA';
import DisqusComments from './DisqusComments';
import RecommendedPosts from './RecommendedPosts';
import '../app/post-content.css';
import '../app/post-widgets.css';

interface Author {
  name: string;
  slug: string;
  twitter?: string;
  website?: string;
  avatar: string;
  bio?: string;
}

interface PostArticleProps {
  articleMdx: string;
  title: string;
  slug: string;
  author: Author;
}

export default async function PostArticle({
  articleMdx,
  title,
  slug,
  author,
}: PostArticleProps) {
  return (
    <div className="l-content in-post">
      <div className="l-wrapper in-post js-aos-wrapper">
        <div className="l-post-content js-progress-content">
          <div className="pos-relative js-post-content post-content">
            <MDXContent source={articleMdx} />
          </div>
        </div>
      </div>

      <AuthorWidget author={author} />

      <HireCTA />

      <div className="l-wrapper in-comments">
        <DisqusComments slug={slug} title={title} />
      </div>

      <RecommendedPosts currentSlug={slug} />
    </div>
  );
}
