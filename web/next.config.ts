import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['dela.com.pe', 'unsplash.com', 'picsum.photos'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dela.com.pe',
        port: '',
        pathname: '/img/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
