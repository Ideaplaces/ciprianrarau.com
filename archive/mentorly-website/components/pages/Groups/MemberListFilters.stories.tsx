import { Meta, Story } from '@storybook/react'
import { GroupProvider } from 'lib/GroupContext'
import { NextQueryParamProvider } from 'lib/next-query-params'
import { UserProvider } from 'lib/UserContext'
import {
  currentGroup,
  mockCurrentGroupQuery,
  mockCurrentUserQuery,
} from 'mocks/'

import MemberListFilters, { MemberListFiltersProps } from './MemberListFilters'

export default {
  title: 'Booking/MemberListFilters',
  component: MemberListFilters,
  argTypes: {},
} as Meta

const mockApollo = {
  apolloClient: {
    mocks: [mockCurrentUserQuery(), mockCurrentGroupQuery()],
  },
}

// @TODO: can't currently use TestWrapper here because MockedProvider causes error
// should be a way to use in both SB and Jest tests
const Template: Story<MemberListFiltersProps> = (args) => (
  <UserProvider>
    <GroupProvider hasServerSideProps={true} groupId={currentGroup.id}>
      <NextQueryParamProvider>
        <MemberListFilters {...args} />
      </NextQueryParamProvider>
    </GroupProvider>
  </UserProvider>
)

export const FrontPage = Template.bind({})
FrontPage.args = {
  frontPage: false,
  setQuery: (query: any) => alert(`selected  ${JSON.stringify(query)}`),
}
FrontPage.parameters = {
  apolloClient: {
    mocks: [...mockApollo.apolloClient.mocks],
  },
}
