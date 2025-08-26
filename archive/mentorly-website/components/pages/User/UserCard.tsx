import { gql } from '@apollo/client'
import UserLocation from 'components/display/UserLocation'
import { VFC } from 'react'
import {
  MenteeProfileDetailsFieldsFragmentDoc,
  MentorProfileDetailsFieldsFragmentDoc,
  UserMediaFieldsFragmentDoc,
} from 'types/graphql'

import MenteeDetails from './MenteeDetails'
import MentorDetails from './MentorDetails'
import Panel from './Panel'
import UserMedia from './UserMedia'

gql`
  fragment UserCardFields on User {
    disciplines {
      name
    }
    name
    location
    pronouns
    ...UserMediaFields
    ...MentorProfileDetailsFields
    ...MenteeProfileDetailsFields
  }
  ${UserMediaFieldsFragmentDoc}
  ${MentorProfileDetailsFieldsFragmentDoc}
  ${MenteeProfileDetailsFieldsFragmentDoc}
`

type UserCardProps = {
  // @ts-expect-error: member does in fact exist on Group
  member: MemberProfileQuery['group']['member']
  isMentor: boolean
}

const UserCard: VFC<UserCardProps> = ({ member, isMentor }) => {
  const { disciplines, name, files, location, pronouns } = member

  return (
    <Panel className="bg-gray md:flex-row-reverse gap-12">
      <section className="w-1/2 max-w-[500px] aspect-square">
        <UserMedia user={member} files={files} />
      </section>
      <section className="flex flex-col flex-start w-full">
        <div className="flex flex-col flex-0 mb-6">
          <div className="flex space-x-2 items-center mb-0">
            <h1 className="font-extrabold text-2xl leading-8">{name}</h1>
            {pronouns && <span className="font-semibold">({pronouns})</span>}
          </div>
          {disciplines && (
            <div id="disciplines" className="mb-0">
              {disciplines
                ?.map((discipline: any) => discipline.name)
                .join(', ')}
            </div>
          )}
          {location && <UserLocation>{location}</UserLocation>}
        </div>
        {isMentor ? (
          <MentorDetails mentor={member} />
        ) : (
          <MenteeDetails mentee={member} />
        )}
      </section>
    </Panel>
  )
}

export default UserCard
