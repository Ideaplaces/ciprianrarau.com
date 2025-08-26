import { gql } from '@apollo/client'
import { LayoutProps } from 'components/Dashboard/Layout'
import { getFeatureFlag } from 'components/Feature'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import Content from 'components/pages/Groups/Content'
import Hero from 'components/pages/Groups/Hero'
import Layout from 'components/pages/Groups/Layout'
import Members from 'components/pages/Groups/Members'
import Redirect from 'components/Redirect'
import { useCurrentGroup } from 'lib/GroupContext'
import { VFC } from 'react'
import {
  GroupContentFieldsFragmentDoc,
  GroupHeroFieldsFragmentDoc,
  GroupHomeQuery,
  GroupHomeQueryVariables,
  useGroupHomeQuery,
} from 'types/graphql'

gql`
  query groupHome($groupId: ID) {
    group(id: $groupId) {
      id
      ...GroupHeroFields
      ...GroupContentFields
    }
  }
  ${GroupHeroFieldsFragmentDoc}
  ${GroupContentFieldsFragmentDoc}
`

type HomePageSubComponentsProps = {
  Layout: VFC<LayoutProps>
}

// @TODO: i think ideally this should be a page file
// currently the home page renders either this, or a completely different Marketplace component
// so using the query there isn't logical, but we shouldn't have queries in components

type HomePageProps = {
  groupId: string
}

const HomePage: VFC<HomePageProps> & HomePageSubComponentsProps = ({
  groupId,
}) => {
  // fontFamily is set in Layout too but only for whiteLabel
  // for greyLabel, it's just this landing page

  const { currentGroup } = useCurrentGroup()

  if (getFeatureFlag(currentGroup, 'skipHomePage')) {
    return <Redirect url="/en/mentors" />
  }

  return (
    <TypedQuery<GroupHomeQueryVariables>
      typedQuery={useGroupHomeQuery}
      variables={{ groupId }}
      runOnServer
    >
      {({ group, loading }: TypedQueryReturn & GroupHomeQuery) => (
        <main
          className="h-full w-full"
          style={
            group?.styles?.fontName
              ? { fontFamily: group?.styles?.fontName }
              : undefined
          }
        >
          <Hero group={group} loading={loading} />
          <Content group={group} loading={loading} />
          <Members frontPage hideBadge />
        </main>
      )}
    </TypedQuery>
  )
}

HomePage.Layout = Layout

export default HomePage
