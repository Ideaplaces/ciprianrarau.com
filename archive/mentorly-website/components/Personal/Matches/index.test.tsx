import '@testing-library/jest-dom'

import { addMocksToSchema } from '@graphql-tools/mock'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { render, screen, waitFor } from '@testing-library/react'
import { graphql, print } from 'graphql'
import schemaString from 'graphql/schema.graphql'
import TestWrapper from 'mocks/TestWrapper'
import mockRouter from 'next-router-mock'
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes'
import {
  ViewerActiveMatchesDocument,
  ViewerActiveMatchesQuery,
} from 'types/graphql'

import PersonalMatches from './'

jest.mock('next/router', () => require('next-router-mock'))
jest.mock('next/dist/client/router', () => require('next-router-mock'))
jest.mock('next/dist/shared/lib/router-context', () => {
  const { createContext } = require('react')
  const router = require('next-router-mock').default
  const RouterContext = createContext(router)
  return { RouterContext }
})

mockRouter.useParser(
  createDynamicRouteParser([
    `/en/personal/matches`,
    `/en/personal/matches?type=mentor`,
    `/en/personal/matches?type=mentee`,
  ])
)

describe('PersonalMatches component', () => {
  let matches: ViewerActiveMatchesQuery['viewer']

  beforeAll(async () => {
    // @TODO: add this to the TestWrapper component
    // allow devs to just pass the Query document and variables
    const schema = makeExecutableSchema({ typeDefs: schemaString })
    const schemaWithMocks = addMocksToSchema({ schema })

    const { data } = await graphql({
      schema: schemaWithMocks,
      source: print(ViewerActiveMatchesDocument),
    })

    matches = data?.viewer as ViewerActiveMatchesQuery['viewer']
  })
  test.skip('renders card list and menu when both type of matches are present', async () => {
    render(
      <TestWrapper>
        <PersonalMatches matches={matches} />
      </TestWrapper>
    )
    await waitFor(() => {
      mockRouter.setCurrentUrl(`/en/personal/matches`)
      const PersonalMatches = screen.getByTestId('member-matches-list')
      expect(PersonalMatches).toBeInTheDocument()
      const MatchesMenu = screen.queryByTestId('matches-menu')
      expect(MatchesMenu).toBeInTheDocument()
    })
  })
})
