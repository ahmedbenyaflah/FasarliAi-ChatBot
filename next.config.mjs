/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip static optimization if Supabase env vars are missing during build
  // This allows the build to succeed even if env vars aren't set
  output: 'standalone',
}

export default nextConfig

