import { gql } from '@apollo/client'
import classNames from 'classnames'
import Avatar from 'components/display/Avatar'
import Link from 'next/link'
import { VFC } from 'react'
import { ChevronRight } from 'react-feather'
import { useIntl } from 'react-intl'
import {
  MainUserFieldsFragment,
  ManagedGroupAvatarsFieldsFragmentDoc,
} from 'types/graphql'

gql`
  fragment MainUserFields on ManagedUser {
    name
    allMatches(active: true, orderBy: $orderMatchesBy) {
      id
    }
    ...ManagedGroupAvatarsFields
  }
  ${ManagedGroupAvatarsFieldsFragmentDoc}
`

type MainUserProps = {
  member: MainUserFieldsFragment
  index?: number
  expanded?: boolean
}

const MainUser: VFC<MainUserProps> = ({ member, index, expanded }) => {
  const { locale } = useIntl()

  const showChevron = (index === 0 || !expanded) && member.allMatches.length > 0
  const showUser = index === 0 || !expanded
  const href = `/${locale}/dashboard/members/${member.id}`

  return (
    <div className="flex items-center">
      <div className="min-w-8 lg:min-w-12 flex items-center justify-center">
        <ChevronRight
          color="#ccc"
          size={20}
          className={classNames('transition duration-200 transform', {
            'rotate-90': expanded,
            'opacity-0': !showChevron,
          })}
        />
      </div>

      {showUser && (
        <div className="group flex items-center w-10/12">
          <Link href={href}>
            <a target="_blank" className="mr-3 hidden md:block">
              <Avatar
                {...member.avatar}
                mentor={member.mentor}
                className="group-hover:opacity-75"
              />
            </a>
          </Link>

          <Link href={href}>
            <a
              className="font-bold group-hover:opacity-75 text-sm lg:text-base truncate"
              target="_blank"
            >
              {member.name}
            </a>
          </Link>
        </div>
      )}
    </div>
  )
}

export default MainUser
