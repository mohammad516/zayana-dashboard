/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {},
    typescript: { 
      ignoreBuildErrors: true,
    },
    images: {
      domains: [
        'res.cloudinary.com',
        'cloudinary.com'
      ],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
  }

module.exports = nextConfig
