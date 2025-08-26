const redirects = [
  {
    source: '/:locale/help',
    destination: 'https://help.mentorly.co/:locale/',
    permanent: false,
  },
  {
    source: '/login',
    destination: '/en/login',
    permanent: false,
  },
  {
    source: '/sign-up',
    destination: '/en/sign-up',
    permanent: false,
  },
  {
    source: '/social-login',
    destination: '/en/social-login',
    permanent: false,
  },
  {
    source: '/mentors((?!m$).*$)',
    has: [
      {
        type: 'query',
        key: 'm',
      },
    ],
    destination: '/en/mentors/:m',
    permanent: false,
  },
  {
    source: '/mentors',
    destination: '/en/mentors',
    permanent: false,
  },
  {
    source: '/sign-up',
    destination: '/en/sign-up',
    permanent: false,
  },
  {
    source: '/conference',
    destination: '/en/personal',
    permanent: false,
  },
  {
    source: '/conference/:id',
    destination: '/en/sessions/:id',
    permanent: false,
  },
  {
    source: '/conference/:id/:extra',
    destination: '/en/sessions/:id',
    permanent: false,
  },
  {
    source: '/about',
    destination: '/en/about',
    permanent: false,
  },
  {
    source: '/bookings/new',
    destination: '/en/personal/new',
    permanent: false,
  },
  {
    source: '/bookings/past',
    destination: '/en/personal',
    permanent: false,
  },
  {
    source: '/bookings',
    destination: '/en/personal',
    permanent: false,
  },
  {
    source: '/bookings/cancelled',
    destination: '/en/personal',
    permanent: false,
  },
  {
    source: '/bookings/:id',
    destination: '/en/sessions/:id',
    permanent: false,
  },
  {
    source: '/privacy',
    destination: '/en/personal',
    permanent: false,
  },
  {
    source: '/b2b-terms',
    destination: '/en/terms',
    permanent: false,
  },
  {
    source: '/terms',
    destination: 'https://marketplace.mentorly.co/en/terms',
    permanent: false,
  },
  {
    source: '/sessions/:id',
    destination: '/en/sessions/:id',
    permanent: false,
  },
  {
    source: '/faq',
    destination:
      'https://intercom.help/mentorly/en/collections/2780229-marketplace-member',
    permanent: false,
  },
  {
    source: '/inkind-fund',
    destination: 'https://marketplace.mentorly.co/en/inkind-fund',
    permanent: false,
  },
  {
    source: '/marketplace',
    destination: 'https://marketplace.mentorly.co/',
    permanent: false,
  },
  {
    source: '/how-it-works',
    destination: '/en/pricing',
    permanent: false,
  },
  {
    source: '/my-bookings',
    destination: '/en/personal',
    permanent: false,
  },
  {
    source: '/my-bookings/:anything',
    destination: '/en/personal',
    permanent: false,
  },
  {
    source: '/calendar',
    destination: '/en/personal/calendar',
    permanent: false,
  },
  {
    source: '/reset-password',
    destination: '/en/reset-password',
    permanent: false,
  },
  {
    source: '/settings/payment',
    destination: '/en/personal/payments',
    permanent: false,
  },
  {
    source: '/settings/profile',
    destination: '/en/personal/profile',
    permanent: false,
  },
  {
    source: '/settings/personal',
    destination: '/en/personal',
    permanent: false,
  },
  {
    source: '/settings',
    destination: '/en/personal',
    permanent: false,
  },
  {
    source: '/inbox',
    destination: '/en/personal/messaging',
    permanent: false,
  },
  {
    source: '/inbox/:id',
    destination: '/en/personal/messaging/:id',
    permanent: false,
  },
]

module.exports = redirects
