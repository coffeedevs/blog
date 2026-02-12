import Image from 'next/image';

interface Author {
  name: string;
  slug: string;
  twitter?: string;
  website?: string;
  avatar: string;
  bio?: string;
}

interface AuthorWidgetProps {
  author: Author;
}

export default function AuthorWidget({ author }: AuthorWidgetProps) {
  return (
    <section className="m-author">
      <div className="m-author__content">
        <div className="m-author__picture">
          <a href={`/author/${author.slug}`} className="m-author-picture">
            <div style={{
              backgroundImage: `url(${author.avatar})`,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '50%',
              backgroundSize: 'cover'
            }} />
          </a>
        </div>
        <div className="m-author__info">
          <h4 className="m-author__name">
            <a href={`/author/${author.slug}`}>{author.name}</a>
          </h4>
          {author.bio && (
            <p className="m-author__bio">{author.bio}</p>
          )}
          <ul className="m-author-links">
            {author.website && (
              <li>
                <a href={author.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </a>
              </li>
            )}
            {author.twitter && (
              <li>
                <a href={`https://twitter.com/${author.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
