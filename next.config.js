/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14

  // Mark native modules as external for server components
  experimental: {
    serverComponentsExternalPackages: ['@node-rs/argon2'],
  },

  // Exclude native Node.js modules from webpack bundling
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle native modules on client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@node-rs/argon2': false,
      };
    } else {
      // On server side, mark as external to avoid webpack bundling
      config.externals = config.externals || [];
      config.externals.push('@node-rs/argon2');
    }
    return config;
  },
}

module.exports = nextConfig
