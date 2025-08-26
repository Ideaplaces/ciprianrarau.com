import ResponsiveCTAButton from 'components/Button/ResponsiveCTAButton'
import { useCurrentGroup } from 'lib/GroupContext'
import { groupHost } from 'lib/urls'
import { useCurrentUser } from 'lib/UserContext'
import { useEffect, VFC } from 'react'
import { Eye } from 'react-feather'

import ResponsiveMenu from './ResponsiveMenu'

const programItems = [
  {
    label: 'menu.info',
    href: '',
    id: 'program',
  },
  {
    label: 'menu.design',
    href: 'program/design',
    id: 'program/design',
  },
  {
    label: 'menu.emails',
    href: 'program/templates',
    id: 'program/templates.*',
  },
  {
    label: 'form.disciplines',
    href: 'program/disciplines',
    id: 'program/disciplines.*',
  },
]

export const ProgramMenu = () => {
  const { currentGroup }: any = useCurrentGroup()
  return (
    <ResponsiveMenu
      headerId="menu.program"
      tabs={programItems}
      CTAbutton={
        <ResponsiveCTAButton
          path={groupHost(currentGroup)}
          messageId="menu.viewSite"
          Icon={Eye}
          external
        />
      }
    />
  )
}

// <Menu items={programItems} />

const reportingItems = [
  {
    label: 'menu.engagement',
    href: 'reporting',
    id: 'reporting',
  },
  {
    label: 'menu.peopleAnalytics',
    href: 'reporting/insights',
    id: 'reporting/insights',
  },
  // { name: 'Miscellaneous', href: '/reporting/miscellaneous' },
]

type ReportingMenuProps = {
  openModal: () => void
  loading: boolean
}

const ReportingMenu: VFC<ReportingMenuProps> = ({
  openModal: _openModal,
  loading,
}) => {
  const { currentUser: _currentUser } = useCurrentUser()
  const { currentGroup }: any = useCurrentGroup()

  // Filter menu items based on admin status and analytics restrictions
  const filteredItems = reportingItems.filter(
    (item) =>
      !(item.id === 'reporting/insights' && currentGroup?.analyticsRestricted)
  )

  return (
    <>
      <ResponsiveMenu
        loading={loading}
        headerId="menu.intelligence"
        tabs={filteredItems}
      />
    </>
  )
}

const MembersMenu = () => {
  const { refetch }: any = useCurrentGroup()

  useEffect(() => {
    refetch()
  }, [])

  const membersItems = [
    {
      label: 'menu.members',
      href: 'members',
      id: 'members',
    },
    {
      label: 'menu.tagGroups',
      href: 'members/tag-groups',
      id: 'members/tag-groups.*',
    },
    {
      label: 'term.cohorts',
      href: 'members/cohorts',
      id: 'members/cohorts.*',
    },
  ]

  return <ResponsiveMenu headerId="menu.members" tabs={membersItems} />
}

const monetizationItems = [
  {
    label: 'menu.settings',
    href: 'monetization',
    id: 'monetization',
  },
  // {
  //   label: 'menu.coupons',
  //   href: 'monetization/coupons',
  //   id: 'monetization/coupons.*',
  // },
  // {
  //   label: 'term.settings',
  //   href: 'monetization/settings',
  //   id: 'monetization/settings.*',
  // },
]

const MonetizationMenu = () => {
  return (
    <ResponsiveMenu headerId="menu.monetization" tabs={monetizationItems} />
  )
}

export { MonetizationMenu, MembersMenu, ReportingMenu }
