import '@testing-library/jest-dom'

import { addMocksToSchema } from '@graphql-tools/mock'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { graphql, print } from 'graphql'
import schemaString from 'graphql/schema.graphql'
import TestWrapper from 'mocks/TestWrapper'
import mockRouter from 'next-router-mock'
import singletonRouter from 'next/router'
import { GroupHomeDocument, GroupHomeQuery } from 'types/graphql'

import HeroCTAButton from './HeroCTAButton'

jest.mock('next/router', () => require('next-router-mock'))
jest.mock('next/dist/client/router', () => require('next-router-mock'))
jest.mock('next/dist/shared/lib/router-context', () => {
  const { createContext } = require('react')
  const router = require('next-router-mock').default
  const RouterContext = createContext(router)
  return { RouterContext }
})

describe('HeroCTAButton component', () => {
  let group: GroupHomeQuery['group']

  beforeAll(async () => {
    // @TODO: add this to the TestWrapper component
    // allow devs to just pass the Query document and variables
    const schema = makeExecutableSchema({ typeDefs: schemaString })
    const schemaWithMocks = addMocksToSchema({ schema })

    const { data } = await graphql({
      schema: schemaWithMocks,
      source: print(GroupHomeDocument),
      variableValues: { groupId: '1' },
    })

    group = data?.group as GroupHomeQuery['group']
  })
  beforeEach(() => {
    mockRouter.setCurrentUrl(`/`)
  })
  test('renders button as link to sign-up or login when no currentUser', async () => {
    render(
      <TestWrapper withoutCurrentUser>
        {/* @TODO: for the sake of this test, we could just define a group object rather than using the query */}
        {/* but there wasn't yet an example of using mock data here so I wanted to have an example */}
        <HeroCTAButton group={group} loading={undefined} />
      </TestWrapper>
    )
    await waitFor(() => {
      const heroLoginButton = screen.getByTestId('hero-login-button')
      const heroSignUpButton = screen.getByTestId('hero-signup-button')
      expect(heroLoginButton).toBeInTheDocument()
      fireEvent.click(heroLoginButton)
      expect(singletonRouter).toMatchObject({ asPath: `/en/login` })
      expect(heroSignUpButton).toBeInTheDocument()
      fireEvent.click(heroSignUpButton)
      expect(singletonRouter).toMatchObject({ asPath: `/en/sign-up` })
    })
  })
  test('renders button as link to dashboard when currentUser is logged-in', async () => {
    render(
      <TestWrapper>
        <HeroCTAButton group={group} loading={undefined} />
      </TestWrapper>
    )
    await waitFor(() => {
      const heroCTAButton = screen.getByTestId('hero-cta-button')
      expect(heroCTAButton).toBeInTheDocument()
      fireEvent.click(heroCTAButton)
      expect(singletonRouter).toMatchObject({
        asPath: `/en/personal`,
      })
    })
  })
})
