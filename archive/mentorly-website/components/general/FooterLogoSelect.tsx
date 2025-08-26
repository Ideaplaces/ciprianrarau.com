import { FC } from 'react'

import GroupLogo from './GroupLogo'
import type { LogoSelectGroup } from './LogoSelect'
import SmallLogo from './SmallLogo'

export type FooterLogoSelectProps = {
  group: LogoSelectGroup
  logoLink?: string
}

export const FooterLogoSelect: FC<FooterLogoSelectProps> = ({
  group,
  logoLink,
}) => {
  if (group?.whiteLabel) {
    return (
      <GroupLogo
        logoLink={logoLink}
        logoUrl={group?.logoImage?.imageUrl}
        name={group?.name}
      />
    )
  }

  return (
    <div className="relative p-4 h-16 w-16 bg-[#E6B629] rounded-lg ">
      <div className="absolute p-5 h-16 w-16 bg-yellow rounded-lg left-0 top-[-2px]">
        <SmallLogo />
      </div>
    </div>
  )
}

export default FooterLogoSelect
