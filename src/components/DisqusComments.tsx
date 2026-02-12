'use client';

import { useEffect } from 'react';

interface DisqusCommentsProps {
  slug: string;
  title: string;
}

export default function DisqusComments({ slug, title }: DisqusCommentsProps) {
  useEffect(() => {
    // Disqus configuration
    const disqusShortname = 'cafedepormedio';
    const disqusConfig = function() {
      // @ts-expect-error - Disqus configuration function context
      this.page.url = `https://blog.coffeedevs.com/${slug}`;
      // @ts-expect-error - Disqus configuration function context
      this.page.identifier = slug;
      // @ts-expect-error - Disqus configuration function context
      this.page.title = title;
    };

    // Load Disqus script
    if (typeof window !== 'undefined') {
      // @ts-expect-error - Disqus global configuration
      window.disqus_config = disqusConfig;

      const script = document.createElement('script');
      script.src = `https://${disqusShortname}.disqus.com/embed.js`;
      script.setAttribute('data-timestamp', String(+new Date()));
      document.body.appendChild(script);
    }
  }, [slug, title]);

  return (
    <section className="m-comments">
      <div id="disqus_thread"></div>
    </section>
  );
}
