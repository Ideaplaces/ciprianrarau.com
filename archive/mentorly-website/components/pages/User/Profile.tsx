import { gql } from '@apollo/client'
import MasterclassList from 'components/pages/User/MasterclassList'
import SEO from 'components/SEO/SEO'
import { useCurrentGroup } from 'lib/GroupContext'
import { useCurrentUser } from 'lib/UserContext'
import { event } from 'nextjs-google-analytics'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import {
  MasterclassDetailsFieldsFragmentDoc,
  Maybe,
  ProfileDetailsFieldsFragmentDoc,
  UserCardFieldsFragmentDoc,
  UserProfilePageFieldsFragment,
} from 'types/graphql'

import ProfileDetails from './ProfileDetails'
import UserCard from './UserCard'

gql`
  fragment UserProfilePageFields on User {
    id
    disciplines {
      name
    }
    role
    location
    profileImageUrl(height: 500, width: 500)
    masterclasses {
      ...MasterclassDetailsFields
    }
    ...UserCardFields
    ...ProfileDetailsFields
  }
  ${ProfileDetailsFieldsFragmentDoc}
  ${MasterclassDetailsFieldsFragmentDoc}
  ${UserCardFieldsFragmentDoc}
`

type ProfileProps = {
  member?: Maybe<UserProfilePageFieldsFragment>
  isMentor?: boolean
}

const Profile: FC<ProfileProps> = ({ member, isMentor = false }) => {
  const { locale, formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const { currentUser } = useCurrentUser()

  if (!member) {
    return null
  }

  if (isMentor) {
    event('Mentor Profile Visit', {
      category: 'Profile Visit',
      label: `visited user ${member.id}`,
      userId: currentUser?.id,
    })
  }

  const disp = member.disciplines?.map((discipline: any) =>
    discipline.name.toLowerCase()
  )

  const memberSEOdescription = formatMessage(
    {
      id: `seo.${currentGroup.marketplace ? 'marketplace' : 'b2b'}${
        isMentor ? 'Mentor' : 'Mentee'
      }Description`,
    },
    {
      name: member.name,
      role: member.role ? member.role.toLowerCase() : '',
      location: member.location,
      discipline: disp?.toString(),
      program: currentGroup.title,
      organisation: currentGroup.name,
    }
  )

  return (
    <>
      <SEO
        title={formatMessage(
          { id: 'seo.bookMentor' },
          {
            name: member.name,
            program: currentGroup
              ? `in ${currentGroup.title} ${locale === 'fr' ? 'de' : 'by'} ${
                  currentGroup.name
                }`
              : 'on Mentorly',
          }
        )}
        description={memberSEOdescription}
        image={member.profileImageUrl}
      />
      <main className="h-full w-full">
        <div className="bg-gray wrapper py-8">
          <UserCard member={member} isMentor={isMentor} />
        </div>
        <div className="wrapper py-8">
          <ProfileDetails member={member} isMentor={isMentor} />
        </div>
        <div id="masterclasses" className="wrapper mentor-sessions mb-6">
          {isMentor && <MasterclassList masterclasses={member.masterclasses} />}
        </div>
      </main>
    </>
  )
}

export default Profile
