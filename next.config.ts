import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  trailingSlash: true,
  async redirects() {
    return [
      // Old Ghost AMP pages → canonical post URL
      {
        source: '/:slug/amp',
        destination: '/:slug/',
        permanent: true,
      },
      // Old Ghost asset URLs
      {
        source: '/assets/:path*',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig);
