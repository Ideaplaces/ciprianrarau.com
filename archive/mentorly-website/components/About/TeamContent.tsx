import { gql } from '@apollo/client'
import TypedQuery from 'components/Graphql/TypedQuery'
import { H3 } from 'components/Headings'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  FounderFieldsFragmentDoc,
  TeamCategoriesQuery,
  TeamCategoriesQueryVariables,
  useTeamCategoriesQuery,
} from 'types/graphql'

import FounderAvatar from './FounderAvatar'

gql`
  query teamCategories($locale: String!) {
    pageContent(id: "b2b.about.team") {
      title(locale: $locale)
      description(locale: $locale)
      body(locale: $locale, format: "html", headerOffset: 0)
    }
    teamCategories {
      founders {
        ...FounderFields
      }
    }
  }
  ${FounderFieldsFragmentDoc}
`

const TeamContent: VFC = () => {
  const { locale } = useIntl()

  return null

  return (
    <TypedQuery<TeamCategoriesQueryVariables>
      typedQuery={useTeamCategoriesQuery}
      variables={{ locale }}
      runOnServer
    >
      {({ pageContent, teamCategories }: TeamCategoriesQuery) => {
        if (!pageContent) {
          console.error('no page content')
          return null
        }

        return (
          <div>
            <H3 className="my-8">{pageContent.title}</H3>
            <div className="flex flex-col flex-wrap md:flex-row mb-8">
              {teamCategories?.founders?.map((founder) => (
                <FounderAvatar key={founder.name} {...founder} />
              ))}
            </div>
            <div
              className="rich-text mb-8"
              dangerouslySetInnerHTML={{ __html: pageContent.body as string }}
            />
          </div>
        )
      }}
    </TypedQuery>
  )
}

export default TeamContent
