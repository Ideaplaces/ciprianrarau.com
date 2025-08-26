import Link from 'next/link'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { Maybe } from 'types/graphql'

import FullLogo from './FullLogo'
import GroupLogo from './GroupLogo'
import SmallLogo from './SmallLogo'

export type LogoSelectGroup = {
  styles?: Maybe<{
    backgroundTextColor?: Maybe<string>
  }>
  marketplace: boolean
  name: string
  logoImage?: Maybe<{
    imageUrl?: Maybe<string>
  }>
  whiteLabel: boolean
}

export type LogoSelectProps = {
  group?: LogoSelectGroup
  logoLink?: string
  isDashboard?: boolean
  isPersonal?: boolean
}

const LogoSelect: FC<LogoSelectProps> = ({ group, logoLink, isDashboard }) => {
  const { locale } = useIntl()
  // Show full Marketplace Logo for Marketplace landing page
  if (!group || group.marketplace || isDashboard) {
    const logo = (
      <FullLogo
        className="fill-current text-black"
        color={
          (!isDashboard && group?.styles?.backgroundTextColor) || undefined
        }
        locale={locale}
        marketplace={group?.marketplace}
      />
    )

    return (
      <div className="w-32 lg:w-36 xl:w-40 mx-4">
        {logoLink || !isDashboard ? (
          <Link href={logoLink || `/${locale}`}>
            <a className="block cursor-pointer">{logo}</a>
          </Link>
        ) : (
          logo
        )}
      </div>
    )
  }

  // Show group logo for white label clients
  if (group.whiteLabel) {
    return (
      <GroupLogo
        logoLink={logoLink}
        logoUrl={group?.logoImage?.imageUrl}
        name={group?.name}
      />
    )
  }

  return (
    <div className="relative w-16 h-16 p-4">
      <SmallLogo className="fill-current text-backgroundTextColor" />
    </div>
  )

  return (
    <div className="w-32 lg:w-36 xl:w-40">
      <a className="block rounded">
        <FullLogo className="fill-current text-black" locale={locale} />
      </a>
    </div>
  )

  // On all group portals personal dashboards show client logo in header
  // Until header colour is redesigned - shown Group Name in bold
  if (!isDashboard) {
    return (
      <GroupLogo
        logoLink={logoLink}
        name={group?.name}
        logoUrl={group?.logoImage?.imageUrl}
      />
    )
  }
}

export default LogoSelect
