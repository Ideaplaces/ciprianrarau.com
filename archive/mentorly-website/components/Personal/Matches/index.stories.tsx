import { addMocksToSchema } from '@graphql-tools/mock'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { Meta, Story } from '@storybook/react'
import mocks from 'data/mocks'
import { graphql, print } from 'graphql'
import schemaString from 'graphql/schema.graphql'
import { GroupProvider } from 'lib/GroupContext'
import { NextQueryParamProvider } from 'lib/next-query-params'
import { UserProvider } from 'lib/UserContext'
import {
  currentGroup,
  mockCurrentGroupQuery,
  mockCurrentUserQuery,
  mockMentorQuery,
} from 'mocks'
import {
  ViewerActiveMatchesDocument,
  ViewerActiveMatchesQuery,
} from 'types/graphql'

import PersonalMatches, { PersonalMatchesProps } from './'

const schema = makeExecutableSchema({ typeDefs: schemaString })
const schemaWithMocks = addMocksToSchema({ schema, mocks })

export default {
  title: 'Matching/MyMatches',
  component: PersonalMatches,
  argTypes: {},
} as Meta

// we need one mock per each graphql call, even if it's the same one
// these are the common api calls, others are defined in parameters of story
const mockApollo = {
  apolloClient: {
    mocks: [mockCurrentUserQuery(), mockCurrentGroupQuery(), mockMentorQuery],
  },
}

const Template: Story<Omit<PersonalMatchesProps, 'matches'>> = (
  args,
  { loaded }
) => {
  return (
    <UserProvider>
      <GroupProvider hasServerSideProps={true} groupId={currentGroup.id}>
        <NextQueryParamProvider>
          <PersonalMatches
            matches={loaded as ViewerActiveMatchesQuery['viewer']}
            {...args}
          />
        </NextQueryParamProvider>
      </GroupProvider>
    </UserProvider>
  )
}

export const NoMatches = Template.bind({})
NoMatches.loaders = [
  async () => {
    const response = await graphql({
      schema: schemaWithMocks,
      source: print(ViewerActiveMatchesDocument),
    })
    const viewer = response?.data?.viewer as ViewerActiveMatchesQuery['viewer']
    return { ...viewer, menteeMatches: undefined, mentorMatches: undefined }
  },
]
NoMatches.args = undefined
NoMatches.parameters = mockApollo

// 👇🏻 These won't work until we can get useNextQueryParams to work in Storybook

// export const MentorWithBothMatches = Template.bind({})
// MentorWithBothMatches.loaders = [
//   async () => {
//     const response = await graphql({
//       schema: schemaWithMocks,
//       source: print(ViewerActiveMatchesDocument),
//     })
//     const viewer = response?.data?.viewer as ViewerActiveMatchesQuery['viewer']
//     return {
//       ...viewer,
//       menteeMatches: matchFactory.buildList(2),
//       mentorMatches: matchFactory.buildList(2),
//     }
//   },
// ]
// MentorWithBothMatches.args = undefined
// MentorWithBothMatches.parameters = {
//   apolloClient: {
//     mocks: [mockCurrentGroupQuery(), mockCurrentUserQuery({ mentor: true })],
//   },
// }
//
// export const MentorWithOnlyMenteeMatches = Template.bind({})
// MentorWithOnlyMenteeMatches.loaders = [
//   async () => {
//     const response = await graphql({
//       schema: schemaWithMocks,
//       source: print(ViewerActiveMatchesDocument),
//     })
//     const viewer = response?.data?.viewer as ViewerActiveMatchesQuery['viewer']
//     return {
//       ...viewer,
//       menteeMatches: matchFactory.buildList(2),
//       mentorMatches: undefined,
//     }
//   },
// ]
// MentorWithOnlyMenteeMatches.args = undefined
// MentorWithOnlyMenteeMatches.parameters = {
//   apolloClient: {
//     mocks: [mockCurrentGroupQuery(), mockCurrentUserQuery({ mentor: true })],
//   },
// }
//
// export const MentorWithOnlyMentorMatches = Template.bind({})
// MentorWithOnlyMentorMatches.loaders = [
//   async () => {
//     const response = await graphql({
//       schema: schemaWithMocks,
//       source: print(ViewerActiveMatchesDocument),
//     })
//     const viewer = response?.data?.viewer as ViewerActiveMatchesQuery['viewer']
//     return {
//       ...viewer,
//       menteeMatches: undefined,
//       mentorMatches: matchFactory.buildList(2),
//     }
//   },
// ]
// MentorWithOnlyMentorMatches.args = undefined
// MentorWithOnlyMentorMatches.parameters = {
//   apolloClient: {
//     mocks: [mockCurrentGroupQuery(), mockCurrentUserQuery({ mentor: true })],
//   },
// }
