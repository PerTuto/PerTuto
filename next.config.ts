import type { NextConfig } from 'next';

import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: ['@genkit-ai/google-genai'],
  experimental: {
  },
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
  async redirects() {
    return [
      // K-12
      { source: '/resources/cbse-mathematics-:grade', destination: '/resources/cbse/mathematics-:grade', permanent: true },
      { source: '/resources/ib-mathematics-aa', destination: '/resources/ib/math-aa-sl', permanent: true },
      { source: '/resources/ib-chemistry', destination: '/resources/ib/chemistry-sl', permanent: true },
      { source: '/resources/igcse-physics', destination: '/resources/caie/physics', permanent: true },
      { source: '/resources/igcse-mathematics', destination: '/resources/caie/mathematics', permanent: true },
      { source: '/resources/a-level-biology', destination: '/resources/edexcel/biology', permanent: true },
      
      // Higher Ed
      { source: '/resources/university-mathematics', destination: '/resources/engineering/mathematics', permanent: true },
      { source: '/resources/university-statistics', destination: '/resources/computer-science/statistics', permanent: true },
      { source: '/resources/research-methods', destination: '/resources/business/research-methods', permanent: true },
      { source: '/resources/academic-writing', destination: '/resources/business/academic-writing', permanent: true },
      
      // Professional
      { source: '/resources/python-programming', destination: '/resources/ai-ml/python', permanent: true },
      { source: '/resources/data-science-ml', destination: '/resources/data-science/machine-learning', permanent: true },
      { source: '/resources/sql-databases', destination: '/resources/web-dev/sql', permanent: true },
      { source: '/resources/web-development', destination: '/resources/web-dev/fundamentals', permanent: true },
      { source: '/resources/cloud-devops', destination: '/resources/web-dev/cloud-devops', permanent: true },
    ];
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

export default withMDX(nextConfig);
