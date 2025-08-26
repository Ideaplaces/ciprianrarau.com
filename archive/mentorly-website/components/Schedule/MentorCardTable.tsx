import { gql } from '@apollo/client'
import { ButtonLink } from 'components/Button/Button'
import Feature from 'components/Feature'
import { parseUrl, profileUrl } from 'lib/urls'
import { isEmpty } from 'lodash'
import Link from 'next/link'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  MentorCardHeaderFieldsFragmentDoc,
  MentorCardTableFieldsFragment,
} from 'types/graphql'

import MentorHeader from './MentorCardHeader'

gql`
  fragment MentorCardTableFields on ManagedUser {
    ...MentorCardHeaderFields
    disciplineNames
    subdisciplineNames
    location
    group {
      id
      slug
    }
    bookable
    mentorSessionsRemaining
    experience
    languages {
      name
    }
    website
  }
  ${MentorCardHeaderFieldsFragmentDoc}
`

type MentorCardTableProps = {
  mentor: MentorCardTableFieldsFragment
  open?: boolean
  setOpen: (open: boolean) => void
}

const MentorCardTable: VFC<MentorCardTableProps> = ({
  mentor,
  open,
  setOpen,
}) => {
  const { formatMessage } = useIntl()
  const tableHeaderStyles = {
    verticalAlign: 'top',
    fontWeight: 'bold',
  }

  const tableContentStyles = {
    verticalAlign: 'top',
    paddingLeft: '10px',
  }

  const { locale } = useIntl()

  const { subdisciplineNames, location, experience, languages, website } =
    mentor

  //@TODO: reuse same component from Profile for this part?
  return (
    <div className="bg-white absolute top-0 left-0 p-6 rounded-md z-50 border border-darkGray w-full shadow-xl cursor-default">
      <MentorHeader mentor={mentor} open={open} setOpen={setOpen} />

      <div>
        <table className="my-4 table-fixed w-full">
          <tbody>
            {!isEmpty(subdisciplineNames) && (
              <Feature id="userSubdisciplines">
                <tr>
                  <td style={tableHeaderStyles}>
                    {formatMessage({ id: 'term.subdisciplines' })}
                  </td>
                  <td style={tableContentStyles}>
                    {subdisciplineNames.join(', ')}
                  </td>
                </tr>
              </Feature>
            )}

            {location ? (
              <tr>
                <td style={tableHeaderStyles}>
                  {formatMessage({ id: 'term.location' })}
                </td>
                <td style={tableContentStyles}>{location}</td>
              </tr>
            ) : null}
            {experience ? (
              <Feature id="userExperience">
                <tr>
                  <td style={tableHeaderStyles}>
                    {formatMessage({ id: 'term.experience' })}
                  </td>
                  <td style={tableContentStyles}>{experience}</td>
                </tr>
              </Feature>
            ) : null}
            <tr>
              <td style={tableHeaderStyles}>
                {formatMessage({ id: 'term.languages' })}
              </td>
              <td style={tableContentStyles}>
                {languages.map((lang) => lang.name).join(', ')}
              </td>
            </tr>
            {website ? (
              <tr>
                <td style={tableHeaderStyles}>
                  {formatMessage({ id: 'term.website' })}
                </td>
                <td style={tableContentStyles} className="break-words">
                  <a
                    href={`https://${parseUrl(website)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accentColor"
                  >
                    {parseUrl(website)}
                  </a>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <Link href={profileUrl(mentor, locale)} passHref>
          <ButtonLink target="_blank" rel="noreferrer" variant="secondary">
            {formatMessage({ id: 'menu.viewProfile' })}
          </ButtonLink>
        </Link>
      </div>
    </div>
  )
}

export default MentorCardTable
