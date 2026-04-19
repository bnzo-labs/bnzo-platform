/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Required for Supabase SSR cookie handling in Server Actions
    // stripe: webpack bundling issues with its internals
    // gray-matter: uses fs which must stay as external
    serverComponentsExternalPackages: ['stripe', 'gray-matter'],
  },
  images: {
    domains: ['bnzo.io'],
  },
}

module.exports = nextConfig
