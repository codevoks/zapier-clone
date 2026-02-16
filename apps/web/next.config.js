/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Only hostnames are allowed here, not full URLs
    domains: [
      'nordicapis.com',
      'cdn-icons-png.flaticon.com',
      'upload.wikimedia.org',
    ],
  },
}

export default nextConfig
