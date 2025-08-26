import { groupFactory } from 'factories/group'
import { groupMenu } from 'lib/groupMenu'

const test = groupFactory.build()
const marketplace = groupFactory.build({
  slug: 'marketplace',
  marketplace: true,
})
const sxsw = groupFactory.build({
  slug: 'sxsw',
  url: 'www.sxsw.com',
})

const basicMenu = [
  {
    id: 'menu.home',
    path: `/`,
  },
  {
    id: 'menu.mentors',
    path: '/mentors',
  },
]
const dashboard = {
  id: 'menu.dashboard',
  path: '/personal',
  needAuth: true,
}
const externalUrl = {
  id: 'menu.externalUrlLink',
  path: 'www.sxsw.com',
  legacy: true,
}
const marketplaceLinks = [
  { id: 'menu.pricing', path: `/pricing` },
  { id: 'menu.inKindFund', path: `/inkind-fund` },
  {
    id: 'menu.faq',
    path: 'https://help.mentorly.co/en/collections/2780339-faq',
    legacy: true,
  },
  { id: 'menu.about', path: `/about` },
]

describe('test group', () => {
  it('should render basic menu with dashboard', () => {
    expect(groupMenu(test)).toStrictEqual([...basicMenu, dashboard])
  })
})
describe('marketplace group', () => {
  it('should render basic menu', () => {
    expect(groupMenu(marketplace)).toStrictEqual([
      ...basicMenu,
      ...marketplaceLinks,
    ])
  })
})
describe('group with external url', () => {
  it('should render basic menu with dashboard and external links', () => {
    expect(groupMenu(sxsw)).toStrictEqual([
      ...basicMenu,
      dashboard,
      externalUrl,
    ])
  })
})
