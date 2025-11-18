import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 't9011321034.p.clickup-attachments.com',
      },
      {
        protocol: 'https',
        hostname: 't9013444626.p.clickup-attachments.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/:path*',
      },
    ];
  },
  transpilePackages: ['@ai-sdk/react'],
};

export default withMDX(config);
