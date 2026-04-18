/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.mapbox.com',
      },
    ],
  },
  output: 'standalone',
  experimental: {
    allowedDevOrigins: ['192.168.1.89', 'localhost'],
  },
};

export default nextConfig;
