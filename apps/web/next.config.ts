import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  transpilePackages: [
    '@ranheim/api',
    '@ranheim/auth',
    '@ranheim/config',
    '@ranheim/types',
    '@ranheim/ui',
  ],
};

export default nextConfig;
