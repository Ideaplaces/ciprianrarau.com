import { headerLogoLink } from 'lib/urls'
import Link from 'next/link'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { Maybe } from 'types/graphql'

export type GroupLogoProps = {
  name?: string
  logoLink?: string
  logoUrl?: Maybe<string>
}

const GroupLogo: VFC<GroupLogoProps> = ({ name, logoLink, logoUrl }) => {
  const { locale } = useIntl()

  return (
    <Link href={headerLogoLink(logoLink, locale)}>
      {logoUrl ? (
        <a className="cursor-pointer h-full max-w-44">
          <img
            src={logoUrl}
            alt={name}
            className="object-contain visible group-hover:hidden h-full"
          />
        </a>
      ) : (
        <a>
          <h1 className="font-extrabold">{name}</h1>
        </a>
      )}
    </Link>
  )
}

export default GroupLogo
