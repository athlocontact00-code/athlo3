import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'images.unsplash.com',
      'cloudinary.com',
      'res.cloudinary.com'
    ],
  },
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['athlo.vercel.app', 'localhost:3000']
    }
  }
};

export default nextConfig;
