/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/admin',
          destination: 'https://admin-kappa-flame.vercel.app/admin',
        },
        {
          source: '/admin/:path*',
          destination: 'https://admin-kappa-flame.vercel.app/admin/:path*',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
