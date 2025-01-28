/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? '/SchedulingAlgorithmSimulator/' : '',
  basePath: isProd ? '/SchedulingAlgorithmSimulator' : '',
  output: 'export',
  eslint: {ignoreDuringBuilds: true},
};

export default nextConfig;