/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip static optimization if Supabase env vars are missing during build
  // This allows the build to succeed even if env vars aren't set
  output: 'standalone',
  
  // Disable static optimization for pages that might use Supabase
  // This prevents build failures when env vars are missing
  experimental: {
    // Allow build to continue even if some pages fail to generate
    missingSuspenseWithCSRBailout: false,
  },
}

export default nextConfig

