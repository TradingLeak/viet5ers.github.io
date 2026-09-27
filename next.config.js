/** @type {import('next').NextConfig} */
// BASE_PATH is injected by the GitHub Pages workflow for project-page hosting.
// Locally (dev & build) it stays empty so the site serves from "/".
const basePath = process.env.BASE_PATH || '';

const nextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'framer-motion'],
  },
};

module.exports = nextConfig;
