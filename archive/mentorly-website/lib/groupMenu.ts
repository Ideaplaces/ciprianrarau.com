import { memberUrl, MemberUrlProps } from 'lib/urls'
import { Maybe } from 'types/graphql'

export type groupMenuPropType = MemberUrlProps['group'] & {
  marketplace: boolean
  hideMentors?: boolean
  url?: Maybe<string>
}

export type GroupMenuType = {
  id: string
  path: string
  className?: string
  legacy?: boolean
  needAuth?: boolean
}

export const groupMenu = (group: groupMenuPropType) => {
  const menu: GroupMenuType[] = [
    {
      id: 'menu.home',
      path: `/`,
    },
  ]

  if (!group?.hideMentors) {
    menu.push({
      id: 'menu.mentors',
      path: memberUrl(group),
    })
  }

  if (group?.marketplace) {
    menu.push(
      { id: 'menu.pricing', path: `/pricing` },
      { id: 'menu.inKindFund', path: `/inkind-fund` },
      {
        id: 'menu.faq',
        path: 'https://help.mentorly.co/en/collections/2780339-faq',
        legacy: true,
      },
      { id: 'menu.about', path: `/about` }
    )
  } else {
    menu.push({
      id: 'menu.dashboard',
      path: '/personal',
      needAuth: true,
    })
  }

  if (group?.url) {
    menu.push({
      id: 'menu.externalUrlLink',
      path: group.url,
      legacy: true,
    })
  }

  return menu
}
