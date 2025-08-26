import { gql } from '@apollo/client'
import Avatar from 'components/display/Avatar'
import Pill from 'components/display/Pill'
import { H4 } from 'components/Headings'
import intersection from 'lodash/intersection'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import {
  ManagedGroupAvatarsFieldsFragmentDoc,
  MentorMatchResponse,
  ResponseFieldsFragment,
} from 'types/graphql'

import styles from './Responses.module.scss'

gql`
  fragment ResponseFields on MentorMatch {
    mentor {
      ...ManagedGroupAvatarsFields
      tags {
        id
        name
      }
    }
    mentee {
      ...ManagedGroupAvatarsFields
      tags {
        id
        name
      }
    }
    responses {
      id
      matchingResponse
      menteeResponse
      mentorResponse
      question {
        id
        key
        question(locale: $locale)
      }
    }
  }
  ${ManagedGroupAvatarsFieldsFragmentDoc}
`

type ResponseProps = {
  match: ResponseFieldsFragment
}

const Responses: FC<ResponseProps> = ({ match }) => {
  const { formatMessage } = useIntl()

  if (match.responses.length === 0) {
    return (
      <div className="flex flex-col space-y-6">
        {formatMessage({ id: 'matches.noResponses' })}
      </div>
    )
  }

  const responses = match.responses.map((res: any) => {
    return (
      <div key={res.key} className="">
        <H4 className="mb-6">{res.question.question}</H4>
        <UserResponse match={match} userSegment="mentor" responses={res} />
        <UserResponse match={match} userSegment="mentee" responses={res} />
      </div>
    )
  })

  const menteeTags = match.mentee?.tags.map((t) => t.name)
  const mentorTags = match.mentor?.tags.map((t) => t.name)

  const commonTags = intersection(mentorTags, menteeTags)

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <H4>Tags</H4>
        <UserTags match={match} userSegment="mentor" commonTags={commonTags} />
        <UserTags match={match} userSegment="mentee" commonTags={commonTags} />
      </div>
      {responses}
    </div>
  )
}

type UserTagsProps = {
  match: ResponseFieldsFragment
  userSegment: 'mentor' | 'mentee'
  commonTags: string[]
}
const UserTags: FC<UserTagsProps> = ({ match, userSegment, commonTags }) => {
  const user = match[userSegment]

  const responseClass = (res: string) => {
    return commonTags.includes(res) ? styles.common : styles.uncommon
  }

  return (
    <div className="flex mb-4">
      <Avatar {...user?.avatar} className="flex flex-shrink-0 mr-4" />
      <div className={`flex flex-col whitespace-wrap justify-center`}>
        <ul className="list-style-none pl-0">
          {user?.tags.length === 0 && <li className={styles.uncommon}>none</li>}
          {user?.tags.map((t) => (
            <li key={t.id} className={responseClass(t.name)}>
              <Pill className="my-1">{t.name}</Pill>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

type UserResponseProps = {
  match: ResponseFieldsFragment
  userSegment: 'mentor' | 'mentee'
  responses: MentorMatchResponse
}
const UserResponse: FC<UserResponseProps> = ({
  match,
  userSegment,
  responses,
}) => {
  const user = match[userSegment]
  const response = responses[`${userSegment}Response`]
  const isMulti = response.length > 1

  const responseClass = (res: string) => {
    return responses.matchingResponse.includes(res)
      ? styles.common
      : styles.uncommon
  }

  return (
    <div className="flex mb-4">
      <Avatar {...user?.avatar} className="flex flex-shrink-0 mr-4" />
      <div
        className={`flex flex-col whitespace-wrap ${
          isMulti ? 'justify-start' : 'justify-center'
        }`}
      >
        <ul className="list-style-none pl-0">
          {response.map((res: string, i: number) => (
            <li key={i} className={responseClass(res)}>
              {res}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Responses
