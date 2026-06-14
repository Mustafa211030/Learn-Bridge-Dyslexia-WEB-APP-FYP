/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  webpack: (config, { dev, isServer }) => {
    // Disable source maps in development
    if (dev) {
      config.devtool = false;
    }

    // Fix watchpack for Windows
    config.snapshot = {
      managedPaths: [],
      immutablePaths: [],
    };

    if (!isServer) {
      config.watchOptions = {
        ignored: /node_modules/,
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    return config;
  },
  
  // Disable source maps
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;