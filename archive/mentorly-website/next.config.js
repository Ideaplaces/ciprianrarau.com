const path = require('path')
// const redirects = require('./lib/redirects')
const removeImports = require('next-remove-imports')({
  experimental: { esmExternals: true },
})

const withTM = require('next-transpile-modules')([
  '@mentorly/react-intercom-hook',
  'query-string',
  'strict-uri-encode',
  'split-on-first',
]) // pass the modules you would like to see transpiled
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
// const getCSP = require('./lib/CSP')

const isProd = process.env.NEXT_PUBLIC_BASE_URL === 'https://mentorly.com'

const headers = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Download-Options', value: 'noopen' },
  { key: 'X-Frame-Options', value: 'deny' },
  { key: 'X-XSS-Protection', value: '1' },
  // { key: 'content-security-policy', value: getCSP() },
]

const config = {
  assetPrefix: isProd ? 'https://cdn.mentorly.com' : undefined,
  compress: false,
  poweredByHeader: false,
  // Enable SWC minify for faster compilation
  swcMinify: true,
  // Enable standalone output for Docker optimization
  output: 'standalone',
  // distDir: 'build',
  images: {
    domains: [
      'images.unsplash.com',
      'cdn.mentorly.com',
      'cdn.mentorly.co',
      'mentorly.com',
      'mentorly.co',
      'mentorlyblog.co',
      'via.placeholder.com',
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers,
      },
    ]
  },
  // async redirects() {
  //   return redirects
  // },
  // i18n: {
  //   locales: ['en', 'fr'],
  //   defaultLocale: 'en',
  // },
  async rewrites() {
    return [
      {
        source: '/en/coaches/:path*',
        destination: '/en/mentors/:path*',
      },
    ]
  },
  webpack(config, options) {
    const originalEntry = config.entry

    // Only disable optimization in development mode
    if (options.dev) {
      config.optimization.minimize = false
    }

    config.entry = async () => {
      const entries = await originalEntry()

      if (
        entries['main.js'] &&
        !entries['main.js'].includes('./lib/polyfills.js')
      ) {
        entries['main.js'].unshift('./lib/polyfills.js')
      }
      return entries
    }

    config.resolve.alias['components'] = path.join(__dirname, 'components')
    config.resolve.alias['lib'] = path.join(__dirname, 'lib')
    config.resolve.alias['types'] = path.join(__dirname, 'types')
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      include: [options.dir],
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    })
    return config
  },
}

module.exports = withBundleAnalyzer(withTM(removeImports(config)))
