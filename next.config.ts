import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    // Product images will come from Cloudinary (module 18/24).
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
