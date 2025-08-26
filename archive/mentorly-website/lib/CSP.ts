import _ from 'lodash'

const SELF = "'self'"
const NONE = "'none'"
const UNSAFE_EVAL = "'unsafe-eval'"
const UNSAFE_INLINE = "'unsafe-inline'"

const CSP = {
  'default-src': [SELF],
  'script-src': [
    SELF,
    UNSAFE_EVAL,
    'https://checkout.stripe.com',
    'https://connect-js.stripe.com',
    'https://connect.facebook.net',
    'https://js.intercomcdn.com',
    'https://js.stripe.com',
    'https://widget.intercom.io',
  ],
  'style-src': [
    SELF,
    UNSAFE_INLINE,
    'https://fonts.googleapis.com',
    'https://js.stripe.com',
    'https://maps.googleapis.com',
    'sha256-0hAheEzaMe6uXIKV4EehS9pu1am1lj/KnnzrOYqckXk=',
  ],
  'object-src': [NONE],
  'base-uri': [SELF],
  'connect-src': [
    SELF,
    'https://*.algolia.net',
    'https://*.algolianet.com',
    'https://*.ingest.sentry.io',
    'https://api-iam.intercom.io',
    'https://api-staging.mentorly.co',
    'https://api.mentorly.com',
    'https://api.stripe.com',
    'https://api2.mentorly.co',
    'https://checkout.stripe.com',
    'https://maps.googleapis.com',
    'https://places-3.algolianet.com/*',
    'wss://nexus-websocket-a.intercom.io',
  ],
  'font-src': [SELF, 'https://fonts.gstatic.com', 'https://js.intercomcdn.com'],
  'form-action': [SELF],
  'frame-src': [
    SELF,
    'https://checkout.stripe.com',
    'https://connect-js.stripe.com',
    'https://hooks.stripe.com',
    'https://js.stripe.com',
    'https://js.stripe.com',
    'https://player.vimeo.com',
  ],
  'frame-ancestors': [NONE],
  'img-src': [
    SELF,
    'data:',
    'https://*.stripe.com',
    'https://imgproxy.mentorly.com',
    'https://js.intercomcdn.com',
    'https://static.intercomassets.com',
    'https://www.facebook.com',
  ],
  'manifest-src': [SELF],
  'media-src': [SELF],
  'worker-src': [NONE],
  // 'prefetch-src': [SELF],
}

if (process.env.NODE_ENV === 'development') {
  CSP['connect-src'].push('http://localhost:3000')
}

const getCSP = () => {
  return _.map(CSP, (v, k) => `${k} ${v.join(' ')}`).join('; ')
}

module.exports = getCSP
