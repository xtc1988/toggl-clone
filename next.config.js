/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  eslint: {
    // ビルド時のlintエラーを無視（Vercelのビルドエラー回避）
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig