import '@testing-library/jest-dom'

import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import IntlProvider from 'components/IntlProvider'
import getMessages from 'lib/getMessages'
import { GroupProvider } from 'lib/GroupContext'
import { NextQueryParamProvider } from 'lib/next-query-params'
import { UserProvider } from 'lib/UserContext'
import {
  mockCurrentGroupQuery,
  mockCurrentUserQuery,
  mockNoCurrentUserQuery,
} from 'mocks'
import { FC, ReactElement } from 'react'
import { GroupEssentialsFieldsFragment } from 'types/graphql'

type TestWrapperProps = {
  mocks?: ReadonlyArray<MockedResponse>
  children: ReactElement
  withoutCurrentUser?: boolean
  group?: GroupEssentialsFieldsFragment
}

const TestWrapper: FC<TestWrapperProps> = ({
  mocks = [],
  children,
  withoutCurrentUser = false,
  group,
}) => {
  const locale = 'en'
  const messages = getMessages(locale)

  const mockedGroupQuery = mockCurrentGroupQuery(group)
  const mockedCurrentUser = mockCurrentUserQuery({ group })

  return (
    <MockedProvider
      mocks={[
        mockedGroupQuery,
        withoutCurrentUser ? mockNoCurrentUserQuery : mockedCurrentUser,
        ...mocks,
      ]}
      addTypename={false}
    >
      <IntlProvider messages={messages} locale={locale}>
        <GroupProvider
          hasServerSideProps={true}
          groupId={mockedGroupQuery.result.data.group.id}
        >
          <UserProvider>
            <NextQueryParamProvider>{children}</NextQueryParamProvider>
          </UserProvider>
        </GroupProvider>
      </IntlProvider>
    </MockedProvider>
  )
}

export default TestWrapper
