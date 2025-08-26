import { gql } from '@apollo/client'
import { addMocksToSchema } from '@graphql-tools/mock'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { Meta, Story } from '@storybook/react'
import mocks from 'data/mocks'
import { graphql, print } from 'graphql'
import schemaString from 'graphql/schema.graphql'
import { GroupProvider } from 'lib/GroupContext'
import { UserProvider } from 'lib/UserContext'
import {
  currentGroup,
  mockCurrentGroupQuery,
  mockCurrentUserQuery,
  mockGroupLocationsQueryWithoutLocation,
} from 'mocks'
import {
  SessionCardFieldsFragment,
  SessionCardFieldsFragmentDoc,
  SessionStoryDocument,
} from 'types/graphql'

import SessionCard, { SessionCardProps } from './'

export default {
  title: 'Booking/SessionCard',
  component: SessionCard,
  argTypes: {},
} as Meta

gql`
  query sessionStory($id: ID!, $locale: String) {
    booking(id: $id) {
      ...SessionCardFields
    }
  }
  ${SessionCardFieldsFragmentDoc}
`

const schema = makeExecutableSchema({ typeDefs: schemaString })
const schemaWithMocks = addMocksToSchema({ schema, mocks })

const mockQueries = {
  apolloClient: {
    mocks: [
      mockCurrentGroupQuery(),
      mockCurrentUserQuery(),
      mockGroupLocationsQueryWithoutLocation,
      mockCurrentGroupQuery(),
    ],
  },
}

const Template: Story<Omit<SessionCardProps, 'booking'>> = (
  args,
  { loaded }
) => {
  // @TODO: get location to work
  return (
    <UserProvider>
      <GroupProvider groupId={currentGroup.id} hasServerSideProps={true}>
        <SessionCard booking={loaded as SessionCardFieldsFragment} {...args} />
      </GroupProvider>
    </UserProvider>
  )
}

export const Default = Template.bind({})
Default.loaders = [
  async () => {
    const response = await graphql({
      schema: schemaWithMocks,
      source: print(SessionStoryDocument),
      variableValues: { id: 1 },
    })
    return {
      ...(response?.data?.booking as SessionCardFieldsFragment),
      location: undefined,
    }
  },
]
Default.args = {
  format: 'dropdown',
}
Default.parameters = mockQueries
