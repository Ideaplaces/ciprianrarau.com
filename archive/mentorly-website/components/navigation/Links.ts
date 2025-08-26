// @TODO: as menus are becomming repeated
// might be nice to separate them out and render accordingly
// for now, this is not in use

export const headerMenu = [
  {
    id: 'menu.home',
    path: '/',
    className: 'hidden xl:block',
  },
  {
    id: 'menu.pricing',
    path: '/pricing',
  },
  {
    id: 'menu.caseStudies',
    path: '/case-studies',
  },
  {
    id: 'menu.faq',
    path: '/faq',
  },
  {
    id: 'menu.marketplace',
    path: 'https://marketplace.mentorly.co/',
    legacy: true,
  },
  {
    id: 'menu.blog',
    path: '/blog',
  },
]

export const footerMenu = [
  {
    id: 'menu.terms',
    path: '/terms',
  },
  {
    id: 'menu.privacy',
    path: '/privacy-policy',
  },
  {
    id: 'menu.help',
    path: `https://help.mentorly.co/`,
    legacy: true,
  },
  {
    id: 'menu.about',
    path: '/about',
  },
]

export const whiteLabelMenu = [
  {
    id: 'menu.home',
    path: '/',
    className: 'hidden xl:block',
  },
  {
    id: 'menu.mentors',
    path: '/mentors',
  },
  {
    id: 'menu.signUp',
    path: '/sign-up',
  },
]
